import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import Chart from 'react-apexcharts';
import './mydashboard.css';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import firebase from 'firebase/app';

const ITEM_TYPE = 'TASK';

const Task = ({ task, moveTask, columnId }) => {
  const [, ref] = useDrag({
    type: ITEM_TYPE,
    item: { id: task.id, columnId },
  });

  return (
    <div ref={ref} className={`kanban-task ${task.projectName.replace(' ', '-')}`}>
      <div className="task-header">
        <strong>{task.projectName}</strong>
        <span className="team-info">{task.category1}</span>
      </div>
      <div className="task-content">{task.category2}</div>
      <div className="task-footer">{task.spentTime} / {task.baseTime} h</div>
    </div>
  );
};

const Column = ({ column, tasks, moveTask }) => {
  const [, ref] = useDrop({
    accept: ITEM_TYPE,
    drop: (item) => moveTask(item.id, item.columnId, column.id),
  });

  return (
    <div ref={ref} className="kanban-column">
      <h3 className="column-title">
        {column.title} <span>{tasks.length}</span>
      </h3>
      {tasks.map((task) => (
        <Task key={task.id} task={task} moveTask={moveTask} columnId={column.id} />
      ))}
    </div>
  );
};

const MyDashboard = () => {
  const totalMonthlyHours = 191;
  const [kanbanData, setKanbanData] = useState({
    tasks: [],
    columns: {
      'column-1': { id: 'column-1', title: '할 일', taskIds: [] },
      'column-2': { id: 'column-2', title: '지연 됨', taskIds: [] },
      'column-3': { id: 'column-3', title: '진행 중', taskIds: [] },
      'column-4': { id: 'column-4', title: '완료', taskIds: [] },
    },
    columnOrder: ['column-1', 'column-2', 'column-3', 'column-4'],
  });

  const [chartData, setChartData] = useState({
    projectSeries: [],
    projectLabels: [],
  });

  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const user = firebase.auth().currentUser;
    if (user) {
      setCurrentUserId(user.uid);
    }
  }, []);

  useEffect(() => {
    if (!currentUserId) return;

    const fetchData = async () => {
      try {
        const snapshot = await db.collection('tasks')
          .where('Usersid', '==', currentUserId)
          .get();

        const fetchedTasks = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // 칸반보드 데이터 초기화
        const columns = {
          'column-1': { ...kanbanData.columns['column-1'], taskIds: [] },
          'column-2': { ...kanbanData.columns['column-2'], taskIds: [] },
          'column-3': { ...kanbanData.columns['column-3'], taskIds: [] },
          'column-4': { ...kanbanData.columns['column-4'], taskIds: [] },
        };

        fetchedTasks.forEach((task) => {
          if (task.status === '할일') columns['column-1'].taskIds.push(task.id);
          else if (task.status === '지연') columns['column-2'].taskIds.push(task.id);
          else if (task.status === '진행중') columns['column-3'].taskIds.push(task.id);
          else if (task.status === '완료') columns['column-4'].taskIds.push(task.id);
        });

        setKanbanData((prevData) => ({
          ...prevData,
          tasks: fetchedTasks,
          columns,
        }));

        // 프로젝트별 소요시간 계산
        const projectTimeMap = {};

        fetchedTasks.forEach((task) => {
          if (!projectTimeMap[task.projectName]) {
            projectTimeMap[task.projectName] = 0;
          }
          projectTimeMap[task.projectName] += parseFloat(task.spentTime) || 0;
        });

        setChartData({
          projectSeries: Object.values(projectTimeMap),
          projectLabels: Object.keys(projectTimeMap),
        });
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchData();
  }, [currentUserId]);

  const moveTask = (taskId, sourceColumnId, targetColumnId) => {
    if (sourceColumnId === targetColumnId) return;

    const sourceColumn = kanbanData.columns[sourceColumnId];
    const targetColumn = kanbanData.columns[targetColumnId];

    const newSourceTaskIds = sourceColumn.taskIds.filter((id) => id !== taskId);
    const newTargetTaskIds = [...targetColumn.taskIds, taskId];

    const updatedColumns = {
      ...kanbanData.columns,
      [sourceColumnId]: { ...sourceColumn, taskIds: newSourceTaskIds },
      [targetColumnId]: { ...targetColumn, taskIds: newTargetTaskIds },
    };

    setKanbanData((prevData) => ({
      ...prevData,
      columns: updatedColumns,
    }));

    const updatedStatus =
      targetColumnId === 'column-1'
        ? '할일'
        : targetColumnId === 'column-2'
        ? '지연'
        : targetColumnId === 'column-3'
        ? '진행중'
        : '완료';

    db.collection('tasks')
      .doc(taskId)
      .update({ status: updatedStatus });
  };

  const monthlyChartOptions = {
    chart: { type: 'donut' },
    labels: chartData.projectLabels,
    colors: ['#34c38f', '#3498db', '#9b59b6', '#e0e0e0', '#a9a9ff'],
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: '총 투입 시간',
              formatter: () => `${totalMonthlyHours} h`,
            },
          },
        },
      },
    },
    dataLabels: { enabled: false },
    legend: { show: false },
  };

  return (
    <div className="my-dashboard">
      <div className="dashboard-section">
        <div className="chart-container pie-chart">
          <h3>프로젝트별 투입 시간</h3>
          <Chart
            options={monthlyChartOptions}
            series={chartData.projectSeries}
            type="donut"
            height={300}
          />
        </div>
      </div>
      <DndProvider backend={HTML5Backend}>
        <div className="kanban-board">
          {kanbanData.columnOrder.map((columnId) => {
            const column = kanbanData.columns[columnId];
            const tasks = column.taskIds.map((taskId) =>
              kanbanData.tasks.find((task) => task.id === taskId)
            );

            return <Column key={column.id} column={column} tasks={tasks} moveTask={moveTask} />;
          })}
        </div>
      </DndProvider>
    </div>
  );
};

export default MyDashboard;
