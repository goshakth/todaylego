import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import Chart from 'react-apexcharts';
import './admindash.css';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const Admindash = () => {
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState(['전체']);
  const [employees, setEmployees] = useState(['전체']);
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({
    project: '사업명',
    team: '부서명',
    employee: '직원명',
    year: new Date().getFullYear().toString(),
    month: (new Date().getMonth() + 1).toString()
  });

  
  const [chartData, setChartData] = useState({
    projectSeries: [],
    projectLabels: [],
    weeklySeries: [],
    weeklyLabels: ['1주차', '2주차', '3주차', '4주차'],
  });

  // Fetch projects and initial tasks
  useEffect(() => {
    const fetchInitialData = async () => {
      // Fetch projects
      const projectSnapshot = await db.collection('projects').get();
      const projectList = projectSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProjects([{ name: '사업명', id: 'all' }, ...projectList]);

      // 캐시된 태스크 데이터 활용
      const cachedData = localStorage.getItem('totaladmin_tasks');
      if (cachedData) {
        const taskList = JSON.parse(cachedData);
        
        // Extract unique teams and employees from cached tasks
        const uniqueTeams = ['부서명', ...new Set(taskList.map(task => task.userTeam).filter(Boolean))];
        const uniqueEmployees = ['직원명', ...new Set(taskList.map(task => task.userName).filter(Boolean))];
        
        setTeams(uniqueTeams);
        setEmployees(uniqueEmployees);
      } else {
        // 캐시된 데이터가 없을 경우 기존 로직 실행
        const taskSnapshot = await db.collection('tasks').get();
        const taskList = taskSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const uniqueTeams = ['부서명', ...new Set(taskList.map(task => task.userTeam).filter(Boolean))];
        const uniqueEmployees = ['직원명', ...new Set(taskList.map(task => task.userName).filter(Boolean))];
        
        setTeams(uniqueTeams);
        setEmployees(uniqueEmployees);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchTasks = () => {
      const cachedData = localStorage.getItem('totaladmin_tasks');
      if (!cachedData) return;

      let taskList = JSON.parse(cachedData);

      // 필터링 로직
      taskList = taskList.filter(task => {
        const taskDate = new Date(task.date);
        const taskYear = taskDate.getFullYear();
        const taskMonth = taskDate.getMonth() + 1;

        const matchesDate = taskYear === parseInt(filters.year) && taskMonth === parseInt(filters.month);
        const matchesProject = filters.project === '사업명' || task.projectName === filters.project;
        const matchesTeam = filters.team === '부서명' || task.userTeam === filters.team;
        const matchesEmployee = filters.employee === '직원명' || task.userName === filters.employee;

        return matchesDate && matchesProject && matchesTeam && matchesEmployee;
      });

      setTasks(taskList);

      // 차트 데이터 처리 로직은 동일하게 유지
      // Chart Data Processing
      const projectTimeMap = {};
      const projectWeeklyData = {};
      const weeklyTimeMap = [0, 0, 0, 0];

      taskList.forEach((task) => {
        const spentTime = parseFloat(task.spentTime) || 0;
        const projectName = task.projectName || '기타';
        const taskDate = new Date(task.date);
        const weekIndex = Math.floor((taskDate.getDate() - 1) / 7);

        // 소수점 첫째 자리까지 반올림
        projectTimeMap[projectName] = Number(((projectTimeMap[projectName] || 0) + spentTime).toFixed(1));

        // 프로젝트별 주간 데이터 집계
        if (!projectWeeklyData[projectName]) {
          projectWeeklyData[projectName] = [0, 0, 0, 0];
        }
        // 소수점 첫째 자리까지 반올림
        projectWeeklyData[projectName][weekIndex] = Number((projectWeeklyData[projectName][weekIndex] + spentTime).toFixed(1));
        weeklyTimeMap[weekIndex] = Number((weeklyTimeMap[weekIndex] + spentTime).toFixed(1));
      });

      // 주간 차트 시리즈 데이터 생성
      const weeklyChartSeries = Object.keys(projectWeeklyData).map(projectName => ({
        name: projectName,
        data: projectWeeklyData[projectName].map(value => Number(value.toFixed(1)))
      }));

      setChartData({
        projectSeries: Object.values(projectTimeMap).map(value => Number(value.toFixed(1))),
        projectLabels: Object.keys(projectTimeMap),
        weeklySeries: weeklyChartSeries,
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
              formatter: () => `${chartData.projectSeries.reduce((a, b) => a + b, 0).toFixed(1)} h`,
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

  // 주간 차트 옵션 수정
  const weeklyChartOptions = {
    chart: {
      type: 'bar',
      stacked: true,
      height: 350
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
        columnWidth: '50%'
      }
    },
    dataLabels: {
      enabled: true,
      total: {
        enabled: true,
        style: {
          fontSize: '13px',
          fontWeight: 900
        }
      }
    },
    xaxis: {
      categories: chartData.weeklyLabels
    },
    yaxis: {
      title: {
        text: '시간'
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left'
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} h`
      }
    }
  };

  return (
    <div className="admindash">
      <div className="admindash-filters-container">
        <div className="admindash-filters-left">
          <select onChange={(e) => handleFilterChange('project', e.target.value)}>
            {projects.map((project) => (
              <option key={project.id} value={project.name}>
                {project.name}
              </option>
            ))}
          </select>

          <select onChange={(e) => handleFilterChange('team', e.target.value)} value={filters.team}>
            {teams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>

          <select onChange={(e) => handleFilterChange('employee', e.target.value)} value={filters.employee}>
            {employees.map((employee) => (
              <option key={employee} value={employee}>
                {employee}
              </option>
            ))}
          </select>
        </div>

        <div className="admindash-filters-right">
          <select onChange={(e) => handleFilterChange('year', e.target.value)} value={filters.year}>
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <option key={year} value={year}>{year}년</option>
            ))}
          </select>
          
          <select onChange={(e) => handleFilterChange('month', e.target.value)} value={filters.month}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
              <option key={month} value={month}>{month}월</option>
            ))}
          </select>
        </div>
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
            options={weeklyChartOptions}
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
                      <span className="team-info">{task.userName}/{task.userTeam}</span>
                    </div>
                    <div className="task-content">
                      <div className="task-row">
                        {task.subcategoriesName && (
                          <div className="subcategory-box">
                            {task.subcategoriesName}
                          </div>
                        )}
                        <div className="task-time">
                          {Number(task.baseTime)}/
                          {Number(task.spentTime).toFixed(1)}/
                          {Number(task.remainingTime) < 0 ? (
                            <span style={{ color: 'red' }}>지연</span>
                          ) : (
                            Number(task.remainingTime).toFixed(1)
                          )}
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
