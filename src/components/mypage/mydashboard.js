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

  // Define custom display for remaining time based on column
  const getRemainingTimeDisplay = () => {
    if (columnId === 'column-2') return <span style={{ color: 'red' }}>지연</span>; // 지연됨 컬럼
    if (columnId === 'column-4') return <span style={{ color: 'blue' }}>완료</span>; // 완료 컬럼
    return `${task.remainingTime}`; // 기본 잔여 시간
  };

  return (
    <div ref={ref} className={`kanban-task ${task.projectName.replace(' ', '-')}`}>
      <div className="task-header">
        <strong>{task.projectName}</strong>
        <span className="team-info">{task.category1}</span>
        <span className="mydashboard-task-name">{task.userName}/{task.userTeam}</span>
      </div>
      <div className="task-content">
        <div className="task-row">
          {task.subcategoriesName && (
            <div className="subcategory-box">{task.subcategoriesName}</div>
          )}
          <div className="task-time">
            {task.baseTime}/{task.spentTime}/{getRemainingTimeDisplay()}
          </div>
        </div>
      </div>
      <div className="task-note">{task.note}</div>
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
    projectSeries: [], // 월별 차트 데이터
    projectLabels: [], // 월별 라벨
    weeklySeries: [{ name: '시간', data: [] }], // 주간 차트 데이터
    weeklyLabels: ['1주차', '2주차', '3주차', '4주차'], // 기본 주간 라벨
  });

  const [currentUserId, setCurrentUserId] = useState(null);
  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });

  useEffect(() => {
    const user = firebase.auth().currentUser;
    if (user) {
      setCurrentUserId(user.uid);
    }
  }, []);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (!currentUserId) return;
  
    const fetchData = async () => {
      try {
        const startOfMonth = new Date(filters.year, filters.month - 1, 1).toISOString();
        const endOfMonth = new Date(filters.year, filters.month, 0).toISOString();
  
        console.log(`Fetching data for range: ${startOfMonth} to ${endOfMonth}`);
        console.log(`Current User ID: ${currentUserId}`);
  
        const snapshot = await db.collection('tasks')
          .where('Usersid', '==', currentUserId)
          .where('date', '>=', startOfMonth)
          .where('date', '<=', endOfMonth)
          .get();
  
        if (snapshot.empty) {
          console.warn('No tasks found for the given filters.');
          setKanbanData((prevData) => ({
            ...prevData,
            tasks: [],
            columns: {
              ...prevData.columns,
              'column-1': { ...prevData.columns['column-1'], taskIds: [] },
              'column-2': { ...prevData.columns['column-2'], taskIds: [] },
              'column-3': { ...prevData.columns['column-3'], taskIds: [] },
              'column-4': { ...prevData.columns['column-4'], taskIds: [] },
            },
          }));
          setChartData({ projectSeries: [], projectLabels: [], weeklySeries: [], weeklyLabels: [] });
          return;
        }
  
        const fetchedTasks = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log('Fetched Tasks:', fetchedTasks);       
     
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
  
        // 차트 데이터 계산
        const projectTimeMap = {};
        const projectWeeklyData = {};
        const weeklyTimeMap = [0, 0, 0, 0];
  
        fetchedTasks.forEach((task) => {
          const spentTime = parseFloat(task.spentTime) || 0; // 문자열을 숫자로 변환하고, 기본값은 0
          const projectName = task.projectName || '기타';
          const taskDate = new Date(task.date);
        
          // 프로젝트별 집계
          projectTimeMap[projectName] = (projectTimeMap[projectName] || 0) + spentTime;
        
          // 주별 집계
          const weekIndex = Math.floor((taskDate.getDate() - 1) / 7);
          if (!projectWeeklyData[projectName]) {
            projectWeeklyData[projectName] = [0, 0, 0, 0];
          }
          projectWeeklyData[projectName][weekIndex] += spentTime;
          weeklyTimeMap[weekIndex] += spentTime;
          
          console.log('Processing Task:', {
            id: task.id,
            projectName,
            spentTime,
            weekIndex,
          });

        });
        console.log('Project Time Map:', projectTimeMap);
        console.log('Weekly Time Map:', weeklyTimeMap);
        console.log('Project Weekly Data:', projectWeeklyData);


        const weeklyChartSeries = Object.keys(projectWeeklyData).map((projectName) => ({
          name: projectName,
          data: projectWeeklyData[projectName],
        }));

        console.log('Weekly Chart Series:', weeklyChartSeries);
  
        if (Object.keys(projectTimeMap).length === 0) {
          console.warn('No project data available.');
        } else {
          console.log('Updating chartData with:', {
            projectSeries: Object.values(projectTimeMap),
            projectLabels: Object.keys(projectTimeMap),
            weeklySeries: [{ name: '시간', data: weeklyTimeMap }],
            weeklyLabels: ['1주차', '2주차', '3주차', '4주차'],
          });
        
          setChartData({
            projectSeries: Object.values(projectTimeMap),
            projectLabels: Object.keys(projectTimeMap),
            weeklySeries: [{ name: '시간', data: weeklyTimeMap }],
            weeklyLabels: ['1주차', '2주차', '3주차', '4주차'],
          });
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
  
    fetchData();
    console.log('chartData.projectSeries:', chartData.projectSeries);
    console.log('chartData.projectLabels:', chartData.projectLabels);
  }, [currentUserId, filters]);
  

  const moveTask = (taskId, sourceColumnId, targetColumnId) => {
    if (sourceColumnId === targetColumnId) return;

    const updatedStatus =
      targetColumnId === 'column-1'
        ? '할일'
        : targetColumnId === 'column-2'
        ? '지연'
        : targetColumnId === 'column-3'
        ? '진행중'
        : '완료';

    db.collection('tasks').doc(taskId).update({ status: updatedStatus });

    setKanbanData((prevData) => {
      const sourceColumn = prevData.columns[sourceColumnId];
      const targetColumn = prevData.columns[targetColumnId];

      const newSourceTaskIds = sourceColumn.taskIds.filter((id) => id !== taskId);
      const newTargetTaskIds = [...targetColumn.taskIds, taskId];

      return {
        ...prevData,
        columns: {
          ...prevData.columns,
          [sourceColumnId]: { ...sourceColumn, taskIds: newSourceTaskIds },
          [targetColumnId]: { ...targetColumn, taskIds: newTargetTaskIds },
        },
      };
    });
  };

  const monthlyChartOptions = {
    chart: { type: 'donut' },
    labels: chartData.projectLabels,
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: 'TOTAL',
              formatter: () => `${chartData.projectSeries.reduce((a, b) => a + b, 0)} h`,
            },
          },
        },
      },
    },
    legend: {
      position: 'right',
      horizontalAlign: 'center',
      fontSize: '15px',
      formatter: (seriesName, opts) => {
        const index = opts.seriesIndex;
        const hours = chartData.projectSeries[index];
        const totalHours = chartData.projectSeries.reduce((a, b) => a + b, 0);
        const percentage = ((hours / totalHours) * 100).toFixed(1);

        return `
          <div style="display: flex; align-items: flex-start; justify-content: space-between; width: 300px;">
            <span style="font-weight: bold; color: #333;">${seriesName}</span>
            <span>${hours} h (${percentage}%)</span>
          </div>
        `;
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} h`,
      },
    },
  };

  const weeklyChartOptions = {
    chart: {
      type: 'bar',
      stacked: true,
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        const total = opts.w.globals.stackedSeriesTotals[opts.dataPointIndex];
        return opts.seriesIndex === opts.w.globals.series.length - 1 ? `${total} h` : '';
      },
      offsetY: -10,
      style: {
        colors: ['#000'],
      },
    },
    xaxis: {
      categories: chartData.weeklyLabels,
    },
    yaxis: {
      title: {
        text: '시간',
      },
    },
    legend: {
      position: 'top',
    },
    fill: {
      opacity: 1,
    },
  };



  return (
    <div className="my-dashboard">
      <div className="filters">
        <select value={filters.year} onChange={(e) => handleFilterChange('year', parseInt(e.target.value))}>
          {[2023, 2024, 2025].map((year) => (
            <option key={year} value={year}>
              {year}년
            </option>
          ))}
        </select>
        <select value={filters.month} onChange={(e) => handleFilterChange('month', parseInt(e.target.value))}>
          {[...Array(12).keys()].map((month) => (
            <option key={month + 1} value={month + 1}>
              {month + 1}월
            </option>
          ))}
        </select>
      </div>

      <div className="dashboard-section">
        <div className="chart-container pie-chart">
          <h3>월간 투입시간</h3>
          {chartData.projectSeries && chartData.projectSeries.length > 0 ? (
            <Chart
              options={monthlyChartOptions}
              series={chartData.projectSeries}
              type="donut"
              height={300}
            />
            
          ) : (
            <p>월간 데이터를 불러오는 중입니다...</p>
          )}
        </div>
        <div className="chart-container bar-chart">
          <h3>주간 투입시간</h3>
          <Chart
            options={weeklyChartOptions}
            series={chartData.weeklySeries}
            type="bar"
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
