import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './mydashboard.css';

const ITEM_TYPE = 'TASK';

const Task = ({ task, moveTask, columnId }) => {
  const [, ref] = useDrag({
    type: ITEM_TYPE,
    item: { id: task.id, columnId },
  });

  return (
    <div ref={ref} className="kanban-task">
      <div className="task-header">
        <div className="task-dot" style={{ backgroundColor: '#34c38f' }}></div>
        <strong>{task.category}</strong>
        <span className="team-info">{task.team}</span>
      </div>
      <div className="task-content">{task.content}</div>
      {task.note && <div className="task-note">{task.note}</div>}
      <div className="task-footer">{task.spent}</div>
    </div>
  );
};

const Column = ({ column, tasks, moveTask, addTask }) => {
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
      <button onClick={() => addTask(column.id)} className="add-task">
        + 작업 추가
      </button>
    </div>
  );
};

const MyDashboard = () => {
  const totalMonthlyHours = 191;

  const monthlyData = {
    series: [108, 35, 24, 18, 6],
    options: {
      chart: { type: 'donut' },
      labels: ['비대면', 'K-Health', 'CRO', '기타', '새싹 생성 3기'],
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
    },
  };

  const weeklyData = {
    series: [
      {
        name: '투입 시간',
        data: [43, 39, 39, 45, 25],
      },
    ],
    options: {
      chart: { type: 'bar', height: 350 },
      xaxis: { categories: ['~ 10.05', '~ 10.12', '~ 10.19', '~ 10.26', '~ 10.31'] },
      colors: ['#34c38f'],
    },
  };

  const [kanbanData, setKanbanData] = useState({
    tasks: {
      'task-1': { id: 'task-1', content: '검토 수정', category: '기타', team: '홍길동 / 경영관리팀', spent: '4 / - / 4' },
      'task-2': { id: 'task-2', content: '초안작성', category: '비대면', team: '홍길동 / 경영관리팀', spent: '30 / 32 / 지연', note: '지연사유: 사업계획서 변경' },
      'task-3': { id: 'task-3', content: '외부회의', category: '비대면', team: '홍길동 / 경영관리팀', spent: '3 / 2 / 1', note: '비대면 ○○○ 회의' },
      'task-4': { id: 'task-4', content: '자문회의', category: 'K-Health', team: '홍길동 / 경영관리팀', spent: '3 / 2 / 완료' },
    },
    columns: {
      'column-1': { id: 'column-1', title: '할 일', taskIds: ['task-1'] },
      'column-2': { id: 'column-2', title: '지연 됨', taskIds: ['task-2'] },
      'column-3': { id: 'column-3', title: '진행 중', taskIds: ['task-3'] },
      'column-4': { id: 'column-4', title: '완료', taskIds: ['task-4'] },
    },
    columnOrder: ['column-1', 'column-2', 'column-3', 'column-4'],
  });

  const moveTask = (taskId, sourceColumnId, targetColumnId) => {
    if (sourceColumnId === targetColumnId) return;

    const sourceColumn = kanbanData.columns[sourceColumnId];
    const targetColumn = kanbanData.columns[targetColumnId];

    const newSourceTaskIds = sourceColumn.taskIds.filter((id) => id !== taskId);
    const newTargetTaskIds = [...targetColumn.taskIds, taskId];

    setKanbanData((prevData) => ({
      ...prevData,
      columns: {
        ...prevData.columns,
        [sourceColumnId]: { ...sourceColumn, taskIds: newSourceTaskIds },
        [targetColumnId]: { ...targetColumn, taskIds: newTargetTaskIds },
      },
    }));
  };

  const addTask = (columnId) => {
    const newTaskId = `task-${Object.keys(kanbanData.tasks).length + 1}`;
    const newTask = {
      id: newTaskId,
      content: '새 작업',
      category: '기타',
      team: '홍길동 / 경영관리팀',
      spent: '0 / 0 / 0',
    };

    setKanbanData((prevData) => ({
      ...prevData,
      tasks: { ...prevData.tasks, [newTaskId]: newTask },
      columns: {
        ...prevData.columns,
        [columnId]: {
          ...prevData.columns[columnId],
          taskIds: [...prevData.columns[columnId].taskIds, newTaskId],
        },
      },
    }));
  };

  return (
    <div className="my-dashboard">
      <div className="dashboard-section">
        <div className="chart-container pie-chart">
          <h3>월간 투입시간</h3>
          <Chart options={monthlyData.options} series={monthlyData.series} type="donut" height={300} />
        </div>
        <div className="chart-container bar-chart">
          <h3>주간 투입시간</h3>
          <Chart options={weeklyData.options} series={weeklyData.series} type="bar" height={300} />
        </div>
      </div>
      <DndProvider backend={HTML5Backend}>
        <div className="kanban-board">
          {kanbanData.columnOrder.map((columnId) => {
            const column = kanbanData.columns[columnId];
            const tasks = column.taskIds.map((taskId) => kanbanData.tasks[taskId]);

            return (
              <Column
                key={column.id}
                column={column}
                tasks={tasks}
                moveTask={moveTask}
                addTask={addTask}
              />
            );
          })}
        </div>
      </DndProvider>
    </div>
  );
};

export default MyDashboard;
