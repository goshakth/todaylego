import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import Chart from 'react-apexcharts';
import './totaladmin.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const Totaladmin = () => {
  const [tasks, setTasks] = useState([]);
  const [visibleTasks, setVisibleTasks] = useState(20);
  const [localStorageSize, setLocalStorageSize] = useState(0);// 용량 계산
  const [chartData, setChartData] = useState({
    yearlyTotal: {
      series: [0],
      labels: ['사용 시간']
    },
    monthlySeries: []
  });

  const TOTAL_YEARLY_HOURS = 2080;
  const CACHE_KEY = 'totaladmin_tasks';
  const CACHE_TIMESTAMP_KEY = 'totaladmin_timestamp';
  const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24시간

  const calculateLocalStorageSize = () => {
    const keys = Object.keys(localStorage);
    let size = 0;
    keys.forEach(key => {
      size += localStorage.getItem(key).length;
    });
    setLocalStorageSize(size);
    console.log(`Local Storage Size: ${size} bytes`);
  };

  useEffect(() => {
    const loadTasks = async () => {
      // 캐시된 데이터 확인
      const cachedData = localStorage.getItem(CACHE_KEY);
      const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
      const now = new Date().getTime();

      // 유효한 캐시가 있는 경우
      if (cachedData && cachedTimestamp && (now - parseInt(cachedTimestamp) < CACHE_DURATION)) {
        const parsedData = JSON.parse(cachedData);
        setTasks(parsedData);
        updateChartData(parsedData);
        calculateLocalStorageSize();
        return;
      }

      // 캐시가 없거나 만료된 경우 새로운 데이터 로드
      try {
        const currentYear = new Date().getFullYear();
        const startDate = new Date(currentYear, 0, 1).toISOString().split('T')[0];
        const endDate = new Date(currentYear, 11, 31).toISOString().split('T')[0];

        const query = db.collection('tasks')
          .where('date', '>=', startDate)
          .where('date', '<=', endDate);

        const taskSnapshot = await query.get();
        const taskList = taskSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // 데이터 캐싱
        localStorage.setItem(CACHE_KEY, JSON.stringify(taskList));
        localStorage.setItem(CACHE_TIMESTAMP_KEY, now.toString());

        setTasks(taskList);
        updateChartData(taskList);
        calculateLocalStorageSize();
      } catch (error) {
        console.error('태스크 조회 중 오류 발생:', error);
      }
    };

    loadTasks();
  }, []);

  // 차트 데이터 업데이트 함수 분리
  const updateChartData = (taskList) => {
    const monthlyData = Array(12).fill(0);
    let totalSpentTime = 0;

    taskList.forEach(task => {
      const taskDate = new Date(task.date);
      const month = taskDate.getMonth();
      const spentTime = parseFloat(task.spentTime) || 0;
      
      monthlyData[month] += spentTime;
      totalSpentTime += spentTime;
    });

    setChartData({
      yearlyTotal: {
        series: [totalSpentTime],
        labels: ['사용 시간']
      },
      monthlySeries: [{
        name: '월별 투입시간',
        data: monthlyData.map(time => Number(time.toFixed(1)))
      }]
    });
  };

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      setVisibleTasks(prev => prev + 20);
    }
  };

  const yearlyChartOptions = {
    chart: { type: 'donut' },
    labels: ['사용 시간', '잔여 시간'],
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: '연간 진행률',
              formatter: function (w) {
                const total = chartData.yearlyTotal.series[0];
                return `${((total / TOTAL_YEARLY_HOURS) * 100).toFixed(1)}%`;
              }
            }
          }
        }
      }
    }
  };

  const monthlyChartOptions = {
    chart: {
      type: 'bar',
      height: 350
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      },
    },
    dataLabels: {
      enabled: true
    },
    xaxis: {
      categories: ['1월', '2월', '3월', '4월', '5월', '6월', 
                  '7월', '8월', '9월', '10월', '11월', '12월']
    },
    yaxis: {
      title: {
        text: '시간'
      }
    }
  };

  const getStatusCount = (status) => {
    return tasks.filter(task => task.status === status).length;
  };

  return (
    <div className="totaladmin">
      <div className="totaladmin-charts">
        <div className="chart-container yearly-chart">
          <h3>2024년 연간 진행률</h3>
          <Chart
            options={yearlyChartOptions}
            series={[chartData.yearlyTotal.series[0], TOTAL_YEARLY_HOURS - chartData.yearlyTotal.series[0]]}
            type="donut"
            height={300}
          />
        </div>
        <div className="chart-container monthly-chart">
          <h3>2024년 월별 투입시간</h3>
          <Chart
            options={monthlyChartOptions}
            series={chartData.monthlySeries}
            type="bar"
            height={300}
          />
        </div>
      </div>

      <DndProvider backend={HTML5Backend}>
        <div className="totaladmin-kanban-board" onScroll={handleScroll}>
          {['할일', '지연', '진행중', '완료'].map((status) => (
            <div key={status} className="totaladmin-kanban-column">
              <h3>{status} ({getStatusCount(status)})</h3>
              {tasks
                .filter(task => task.status === status)
                .slice(0, visibleTasks)
                .map((task) => (
                  <div key={task.id} className="totaladmin-kanban-task">
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

export default Totaladmin; 