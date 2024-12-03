import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import Chart from 'react-apexcharts';
import './admindash.css';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const Admindash = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({
    project: '전체',
    team: '전체',
  });

  
  const [chartData, setChartData] = useState({
    projectSeries: [],
    projectLabels: [],
    weeklySeries: [],
    weeklyLabels: ['1주차', '2주차', '3주차', '4주차'],
  });

  // Fetch projects, users, and tasks from Firebase
  useEffect(() => {
    const fetchProjects = async () => {
      const projectSnapshot = await db.collection('projects').get();
      const projectList = projectSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProjects([{ name: '전체', id: 'all' }, ...projectList]);
    };

    const fetchUsers = async () => {
      const userSnapshot = await db.collection('Users').get();
      const userList = userSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers([{ name: '전체', team: 'all' }, ...userList]);
    };

    fetchProjects();
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      let query = db.collection('tasks');

      if (filters.project !== '전체') {
        query = query.where('projectName', '==', filters.project);
      }

      if (filters.team !== '전체') {
        query = query.where('team', '==', filters.team);
      }

      const taskSnapshot = await query.get();
      const taskList = taskSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTasks(taskList);

      // Chart Data Processing
      const projectTimeMap = {};
      const weeklyTimeMap = [0, 0, 0, 0];

      taskList.forEach((task) => {
        const spentTime = parseFloat(task.spentTime) || 0;
        const projectName = task.projectName || '기타';
        const taskDate = new Date(task.date);
        const weekIndex = Math.floor((taskDate.getDate() - 1) / 7);

        projectTimeMap[projectName] = (projectTimeMap[projectName] || 0) + spentTime;
        weeklyTimeMap[weekIndex] += spentTime;
      });

      setChartData({
        projectSeries: Object.values(projectTimeMap),
        projectLabels: Object.keys(projectTimeMap),
        weeklySeries: [{ name: '시간', data: weeklyTimeMap }],
        weeklyLabels: ['1주차', '2주차', '3주차', '4주차'],
      });
    };

    fetchTasks();
  }, [filters]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const admonthlyChartOptions = {
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

  return (
    <div className="admindash">
      <div className="admindash-filters">
        <select onChange={(e) => handleFilterChange('project', e.target.value)}>
          {projects.map((project) => (
            <option key={project.id} value={project.name}>
              {project.name}
            </option>
          ))}
        </select>
        <select onChange={(e) => handleFilterChange('team', e.target.value)}>
          {users.map((user) => (
            <option key={user.id} value={user.team}>
              {user.team}
            </option>
          ))}
        </select>
      </div>

      <div className="admindash-section">
        <div className="admindash-chart-container pie-chart">
          <h3>월간 투입시간</h3>
          <Chart
            options={admonthlyChartOptions}
            series={chartData.projectSeries}
            type="donut"
            height={300}
          />
        </div>
        <div className="admindash-chart-container bar-chart">
          <h3>주간 투입시간</h3>
          <Chart
            options={{
              chart: { type: 'bar' },
              xaxis: { categories: chartData.weeklyLabels },
            }}
            series={chartData.weeklySeries}
            type="bar"
            height={300}
          />
        </div>
      </div>

      <DndProvider backend={HTML5Backend}>
        <div className="admindash-kanban-board">
          {['할일', '지연', '진행중', '완료'].map((status) => (
            <div key={status} className="admindash-kanban-column">
              <h3>{status}</h3>
              {tasks
                .filter((task) => task.status === status)
                .map((task) => (
                  <div key={task.id} className="admindash-kanban-task">
                    <div className="task-header">
                      <strong>{task.projectName}</strong>
                      <span className="team-info">{task.team}</span>
                    </div>
                    <div className="task-content">
                      <div className="task-row">
                        {task.subcategoriesName && (
                          <div className="subcategory-box">
                            {task.subcategoriesName}
                          </div>
                        )}
                        <div className="task-time">
                          {task.baseTime}/{task.spentTime}/{task.remainingTime}
                        </div>
                      </div>
                    </div>
                    <div className="task-note">{task.note}</div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </DndProvider>
    </div>
  );
};

export default Admindash;
