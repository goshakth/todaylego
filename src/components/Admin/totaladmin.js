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

  const [projects, setProjects] = useState([{ name: '사업명', id: 'all' }]);
  const [teams, setTeams] = useState(['부서명']);
  const [employees, setEmployees] = useState(['직원명']);
  const [filters, setFilters] = useState({
    project: '사업명',
    team: '부서명',
    employee: '직원명',
    startDate: '',  // 시작일
    endDate: ''     // 종료일
  });

  const [filteredTasks, setFilteredTasks] = useState([]);

  const TOTAL_YEARLY_HOURS = 2800;
  const CACHE_KEY = 'totaladmin_tasks';
  const CACHE_TIMESTAMP_KEY = 'totaladmin_timestamp';
  const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7일

  // 업데이트된 사용자 ID 목록 추가
  const updatedUserIds = [
    "HbwbeTXYxtqqP38ZwpaZ",
  ];

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

  // 차트 데이터 업데이트 함수 수정
  const updateChartData = (taskList) => {
    // 필터링된 태스크 목록 생성
    const filteredTasks = taskList.filter(task => {
      if (filters.employee !== '직원명') {
        return task.userName === filters.employee;
      }
      return false;
    });

    // 프로젝트별 소요시간을 저장할 객체
    const projectSpentTimes = {};
    const monthlyTotalData = Array(12).fill(0);
    let totalSpentTime = 0;  // 전체 소요시간

    // 각 태스크를 한 번만 처리
    const processedTasks = new Set();  // 처리된 태스크를 추적

    filteredTasks.forEach(task => {
      // 이미 처리된 태스크는 건너뛰기
      const taskId = task.id || `${task.date}-${task.projectName}`;
      if (processedTasks.has(taskId)) return;
      processedTasks.add(taskId);

      const spentTime = parseFloat(task.spentTime) || 0;
      const projectName = task.projectName || '기타';
      const taskDate = new Date(task.date);
      const monthIndex = taskDate.getMonth();

      // 프로젝트별 소요시간 누적
      if (!projectSpentTimes[projectName]) {
        projectSpentTimes[projectName] = 0;
      }
      projectSpentTimes[projectName] += spentTime;

      // 월별 소요시간 누적
      monthlyTotalData[monthIndex] += spentTime;

      // 전체 소요시간 누적
      totalSpentTime += spentTime;
    });

    // 데이터가 있는 경우에만 차트 업데이트
    if (totalSpentTime > 0) {
      // 프로젝트별 데이터 정렬
      const sortedProjects = Object.entries(projectSpentTimes)
        .sort((a, b) => b[1] - a[1])
        .filter(([_, time]) => time > 0);

      // 모든 시간 값을 2로 나눔
      const adjustedTotal = totalSpentTime;
      const adjustedSeries = sortedProjects.map(([_, time]) => time);
      const labels = sortedProjects.map(([name, _]) => name);

      setChartData({
        yearlyTotal: {
          series: adjustedSeries,
          labels: labels,
          total: adjustedTotal
        },
        monthlySeries: [{
          name: '월별 투입시간',
          data: monthlyTotalData
        }]
      });
    } else {
      setChartData({
        yearlyTotal: {
          series: [],
          labels: [],
          total: 0
        },
        monthlySeries: [{
          name: '월별 투입시간',
          data: Array(12).fill(0)
        }]
      });
    }
  };

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    
    // 스크롤이 하단에서 100px 이내일 때 추가 로드
    if (scrollHeight - scrollTop <= clientHeight + 100) {
      // 필터링된 전체 태스크 수 확인
      const filteredTasksCount = getFilteredTasks().length;
      
      // 현재 보여지는 태스크 수가 전체 태스크 수보다 적을 때만 추가
      if (visibleTasks < filteredTasksCount) {
        setVisibleTasks(prev => prev + 20);
      }
    }
  };

  const yearlyChartOptions = {
    chart: { 
      type: 'donut',
    },
    labels: chartData.yearlyTotal.labels,
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: 'TOTAL',
              formatter: function (w) {
                // 총 소요시간 계산 수정
                //const total = chartData.yearlyTotal.series.reduce((acc, val) => acc + val, 0);
                const total = chartData.yearlyTotal.total;
                // 사업이 선택된 경우
                if (filters.project !== '사업명') {
                  return `${filters.project}\n${total.toFixed(1)} h`;
                }
                // 직원이 선택된 경우
                else if (filters.employee !== '직원명') {
                  return `${filters.employee}\n${total.toFixed(1)} h`;
                }
                // 아무것도 선택되지 않은 경우
                return '사업/직원 선택';
              }
            }
          }
        }
      }
    },
    tooltip: {
      y: {
        formatter: function(value) {
          // 툴크 값도 2로 나누어 표시
          return `${(value / 2).toFixed(1)}h`;
        }
      }
    },
    legend: {
      position: 'right',
      formatter: function(seriesName, opts) {
        if (!opts || !opts.w || !opts.w.globals || !opts.w.globals.series) {
          return `${seriesName} - 0.0h (0.0%)`;
        }

        // 레전드 값도 2로 나누어 표시
        const value = (opts.w.globals.series[opts.seriesIndex] || 0) / 2;
        const total = (chartData.yearlyTotal.total || 0) / 2;
        
        if (total === 0) {
          return `${seriesName} - ${value.toFixed(1)}h (0.0%)`;
        }
        
        const percentage = ((value / total) * 100).toFixed(1);
        return `${seriesName} - ${value.toFixed(1)}h (${percentage}%)`;
      }
    }
  };

  // 공통으로 사용할 formatter 함수
  const formatValue = (value) => {
    return typeof value === 'number' ? value.toFixed(1) : '0.0';
  };

  const [selectedCategory, setSelectedCategory] = useState(null);

  const [monthlyChartOptions, setMonthlyChartOptions] = useState({
    chart: {
      type: 'bar',
      stacked: true,
      toolbar: {
        show: true
      },
      events: {
        dataPointSelection: function(event, chartContext, config) {
          const category = config.w.globals.labels[config.dataPointIndex];
          setSelectedCategory(category);
          setSelectedSubcategory('전체');  // 새 카테고리 선택 시에만 '전체'로 초기화
        }
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
      },
    },
    xaxis: {
      categories: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
      labels: {
        show: true,
        rotate: -45,
        style: {
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      title: {
        text: '소요시간 (시간)'
      },
      labels: {
        formatter: function(value) {
          return formatValue(value);
        }
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function(value) {
          return `${formatValue(value)}h`;
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function(value) {
        return formatValue(value);
      }
    }
  });

  const getStatusCount = (status) => {
    return tasks.filter(task => task.status === status).length;
  };

  // 새로고침 함수 추가
  const handleRefresh = async () => {
    try {
      const currentYear = new Date().getFullYear();
      
      // 기존 캐시된 데이터 가져오기
      const cachedData = localStorage.getItem(CACHE_KEY);
      let existingTasks = cachedData ? JSON.parse(cachedData) : [];

      // 업데이트된 사용자들의 기존 데이터 제거
      const filteredTasks = existingTasks.filter(task => 
        !updatedUserIds.includes(task.Uesrsid)
      );

      // 업데이트된 사용자들의 새로운 데이터만 가져오기
      let updatedTasks = [];
      for (const userId of updatedUserIds) {
        const query = db.collection('tasks')
          .where('Uesrsid', '==', userId)
          .where('date', '>=', `${currentYear}-01-01`)
          .where('date', '<=', `${currentYear}-12-31`);

        const taskSnapshot = await query.get();
        const userTasks = taskSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        updatedTasks = [...updatedTasks, ...userTasks];
      }

      // 기존 데이터와 새로운 데이터 병합
      const mergedTasks = [...filteredTasks, ...updatedTasks];

      // 데이터 캐싱
      localStorage.setItem(CACHE_KEY, JSON.stringify(mergedTasks));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, new Date().getTime().toString());

      setTasks(mergedTasks);
      updateChartData(mergedTasks);
      calculateLocalStorageSize();
      
      alert(`${updatedUserIds.length}명의 사용자 데이터가 업데이트되었습니다. (${updatedTasks.length}개)`);
    } catch (error) {
      console.error('데이터 업데이트 중 오류 발생:', error);
      alert('데이터 업데이트 중 오류가 발생했습니다.');
    }
  };

  // 프로젝트 목록 가져오기
  useEffect(() => {
    const fetchProjects = async () => {
      const projectSnapshot = await db.collection('projects').get();
      const projectList = projectSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProjects([{ name: '사업명', id: 'all' }, ...projectList]);
    };
    fetchProjects();
  }, []);

  // 팀과 직원 목록 업데이트
  useEffect(() => {
    if (tasks.length > 0) {
      const uniqueTeams = ['부서명', ...new Set(tasks.map(task => task.userTeam).filter(Boolean))];
      const uniqueEmployees = ['직원명', ...new Set(tasks.map(task => task.userName).filter(Boolean))];
      setTeams(uniqueTeams);
      setEmployees(uniqueEmployees);
    }
  }, [tasks]);

  // 소분류 필터 상태 수정
  const [selectedSubcategory, setSelectedSubcategory] = useState('전체');

  // 선택된 카테고리의 소분류 목록을 가져오는 함수 수정
  const getSubcategories = () => {
    if (!selectedCategory) return [];
    
    // 캐시된 데이터에서 모든 태스크 가져오기
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (!cachedData) return [];
    
    const allTasks = JSON.parse(cachedData);
    
    // 현재 선택된 카테고리와 프로젝트에 해당하는 모든 소분류 가져오기
    const subcategories = allTasks
      .filter(task => 
        task.categoriesName === selectedCategory && 
        (filters.project === '사업명' || task.projectName === filters.project)
      )
      .map(task => task.subcategoriesName)
      .filter((subcategory, index, self) => 
        subcategory && self.indexOf(subcategory) === index
      );
    
    return ['전체', ...subcategories];
  };

  // getFilteredTasks 함수 수정
  const getFilteredTasks = () => {
    return tasks.filter(task => {
      const matchesProject = filters.project === '사업명' || task.projectName === filters.project;
      const matchesTeam = filters.team === '부서명' || task.userTeam === filters.team;
      const matchesEmployee = filters.employee === '직원명' || task.userName === filters.employee;
      const matchesCategory = !selectedCategory || task.categoriesName === selectedCategory;
      const matchesSubcategory = selectedSubcategory === '전체' || task.subcategoriesName === selectedSubcategory;
      
      const taskDate = new Date(task.date);
      const matchesDateRange = (!filters.startDate || taskDate >= new Date(filters.startDate)) &&
                             (!filters.endDate || taskDate <= new Date(filters.endDate));
      
      return matchesProject && matchesTeam && matchesEmployee && matchesDateRange && 
             matchesCategory && matchesSubcategory;
    });
  };

  // 필터 변경 핸들러 수정
  const handleFilterChange = async (field, value) => {
    let newFilters;
    
    if (field === 'employee') {
      newFilters = {
        ...filters,
        employee: value,
        project: '사업명'
      };
      setFilters(newFilters);

      const projectSelect = document.querySelector('select[name="project"]');
      if (projectSelect) {
        projectSelect.value = '';
      }

      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const taskList = JSON.parse(cachedData);
        
        if (value !== '직원명') {
          // 선택된 직원의 태스크 필터링
          const filteredTasks = taskList.filter(task => task.userName === value);
          
          // 사업별 시간 집계
          const projectTimeData = {};
          let totalTime = 0;

          // 먼저 모든 프로젝트 목록 수집
          const allProjects = new Set();
          filteredTasks.forEach(task => {
            const projectName = task.projectName || '미지정';
            const spentTime = parseFloat(task.spentTime) || 0;
            
            if (!projectTimeData[projectName]) {
              projectTimeData[projectName] = 0;
            }
            projectTimeData[projectName] += spentTime;
            totalTime += spentTime;
          });

          // 월별 데이터 초기화
          const monthlyData = Array(12).fill().map(() => {
            const monthObj = {};
            allProjects.forEach(project => {
              monthObj[project] = 0;
            });
            return monthObj;
          });

          // 데이터 집계
          filteredTasks.forEach(task => {
            const projectName = task.projectName || '미지정';
            const spentTime = parseFloat(task.spentTime) || 0;
            
            // 프로젝트별 총 시간 집계
            if (!projectTimeData[projectName]) {
              projectTimeData[projectName] = 0;
            }
            projectTimeData[projectName] += spentTime;
            totalTime += spentTime;

            // 월별 데이터 집계
            const month = new Date(task.date).getMonth();
            if (month >= 0 && month < 12) {  // 유효한 월인지 확인
              monthlyData[month][projectName] = (monthlyData[month][projectName] || 0) + spentTime;
            }
          });

          // 사업별 데이터 정렬
          const sortedProjects = Object.entries(projectTimeData)
            .sort((a, b) => b[1] - a[1])
            .filter(([_, time]) => time > 0);

          // 차트 데이터 업데이트
          setChartData({
            yearlyTotal: {
              series: sortedProjects.map(([_, time]) => time),
              labels: sortedProjects.map(([name, _]) => name),
              total: totalTime /2
            },
            monthlySeries: sortedProjects.map(([projectName, _]) => ({
              name: projectName,
              data: monthlyData.map(month => month[projectName] || 0)
            }))
          });

          // 차트 옵션 업데이트
          setMonthlyChartOptions({
            chart: {
              type: 'bar',
              stacked: true,
              toolbar: {
                show: true
              }
            },
            plotOptions: {
              bar: {
                horizontal: false,
                columnWidth: '55%',
              },
            },
            xaxis: {
              categories: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
              title: {
                text: '월별'
              },
              labels: {
                show: true,
                rotate: -45,
                style: {
                  fontSize: '12px'
                }
              }
            },
            yaxis: {
              title: {
                text: '소요시간 (시간)'
              },
              labels: {
                formatter: function(value) {
                  return formatValue(value);
                }
              }
            },
            fill: {
              opacity: 1
            },
            colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#546E7A', '#26a69a', '#D10CE8'],
            tooltip: {
              y: {
                formatter: function(value) {
                  return `${formatValue(value)}h`;
                }
              }
            },
            dataLabels: {
              enabled: true,
              formatter: function(value) {
                return formatValue(value);
              }
            },
            legend: {
              show: false
            }
          });
        } else {
          // 직원 미선택 시 초기화
          updateChartData(taskList);
        }
      }
    } else {
      // 다른 필터들 처리 (기존 코드 유지)
      newFilters = { ...filters, [field]: value };
      setFilters(newFilters);
      
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const taskList = JSON.parse(cachedData);
        const filteredTasks = taskList.filter(task => {
          const matchesTeam = filters.team === '부서명' || task.userTeam === filters.team;
          const matchesEmployee = filters.employee === '직원명' || task.userName === filters.employee;
          const taskDate = new Date(task.date);
          const matchesDateRange = (!filters.startDate || taskDate >= new Date(filters.startDate)) &&
                                 (!filters.endDate || taskDate <= new Date(filters.endDate));
          return matchesTeam && matchesEmployee && matchesDateRange;
        });
        updateChartData(filteredTasks);
      }
    }
  };

  // 직원별 시간 통계를 계산하는 함수 수정
  const calculateEmployeeStats = () => {
    const stats = {};
    const startDate = filters.startDate ? new Date(filters.startDate) : null;
    const endDate = filters.endDate ? new Date(filters.endDate) : null;
    const HOURS_PER_DAY = 8;
    
    // 날짜 필터를 적용한 태스크 필터링
    const filteredTasks = tasks.filter(task => {
      const taskDate = new Date(task.date);
      return (!startDate || taskDate >= startDate) && 
             (!endDate || taskDate <= endDate);
    });
    
    filteredTasks.forEach(task => {
      const taskDate = new Date(task.date);
      if (!stats[task.userName]) {
        stats[task.userName] = {
          totalSpentTime: 0,
          totalRemainingTime: 0,
          overdueTasks: 0,
          firstTaskDate: null,
          lastTaskDate: null,
          workingDays: 0,
          standardTime: 0
        };
      }

      // 첫 업무일과 마지막 업무일 갱신
      if (!stats[task.userName].firstTaskDate || 
          taskDate < new Date(stats[task.userName].firstTaskDate)) {
        stats[task.userName].firstTaskDate = task.date;
      }
      if (!stats[task.userName].lastTaskDate || 
          taskDate > new Date(stats[task.userName].lastTaskDate)) {
        stats[task.userName].lastTaskDate = task.date;
      }
      
      // 소요시간 계산 수정
      stats[task.userName].totalSpentTime += Number(task.spentTime) || 0; // 소요시간
      stats[task.userName].totalRemainingTime += Number(task.remainingTime) || 0; // 남은 시간
      
      if (Number(task.remainingTime) < 0) {
        stats[task.userName].overdueTasks += 1;
      }
    });

    // 근무일수 및 기준시간 계산
    Object.values(stats).forEach(stat => {
      const first = new Date(Math.max(
        startDate ? startDate.getTime() : new Date(stat.firstTaskDate).getTime(),
        new Date(stat.firstTaskDate).getTime()
      ));
      const last = new Date(Math.min(
        endDate ? endDate.getTime() : new Date(stat.lastTaskDate).getTime(),
        new Date(stat.lastTaskDate).getTime()
      ));
      
      // 주말을 제외한 근무일수 계산
      let workingDays = 0;
      for (let d = new Date(first); d <= last; d.setDate(d.getDate() + 1)) {
        if (d.getDay() !== 0 && d.getDay() !== 6) { // 0은 일요일, 6은 토요일
          workingDays++;
        }
      }
      
      stat.workingDays = workingDays;
      stat.standardTime = workingDays * HOURS_PER_DAY;
    });

    // 소요시간 기준 내림차순 정렬
    const sortedStats = Object.entries(stats)
      .map(([name, data]) => ({
        name,
        ...data
      }))
      .filter(stat => stat.workingDays > 0) // 데이터가 있는 경우만 표시
      .sort((a, b) => b.totalSpentTime - a.totalSpentTime);

    return sortedStats;
  };

  // 사업별 필터링 핸들러 수정
  const handleProjectFilter = async (projectName) => {
    setFilters({
      ...filters,
      employee: '직원명',
      project: projectName
    });

    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      const taskList = JSON.parse(cachedData);
      
      if (!projectName || projectName === '사업명') {
        setFilteredTasks(taskList);
        updateChartData(taskList);
        return;
      }

      // 선택된 사업의 태스크만 필터링
      const projectTasks = taskList.filter(task => task.projectName === projectName);
      setFilteredTasks(projectTasks);  // 필터링된 태스크 저장
      
      // 직원별 시간 집계
      const employeeTimeData = {};
      // 카테고리별 시간 집계
      const categoryTimeData = {};
      let totalProjectTime = 0;

      projectTasks.forEach(task => {
        const userName = task.userName || '미지정';
        const category = task.categoriesName || '미분류';
        const spentTime = parseFloat(task.spentTime) || 0;

        // 직원별 시간 집계
        if (!employeeTimeData[userName]) {
          employeeTimeData[userName] = 0;
        }
        employeeTimeData[userName] += spentTime;

        // 카테고리별 시간 집계
        if (!categoryTimeData[category]) {
          categoryTimeData[category] = 0;
        }
        categoryTimeData[category] += spentTime;

        totalProjectTime += spentTime;
      });

      // 카테고리별 데이터 정렬
      const sortedCategories = Object.entries(categoryTimeData)
        .sort((a, b) => b[1] - a[1])
        .filter(([_, time]) => time > 0);

      // 차트 데이터 업데이트
      setChartData({
        yearlyTotal: {
          series: sortedCategories.map(([_, time]) => time),
          labels: sortedCategories.map(([name, _]) => name),
          total: totalProjectTime
        },
        monthlySeries: [{
          name: '업무 카테고리별 시간',
          data: sortedCategories.map(([_, time]) => time)
        }]
      });

      // 사업별 보기의 가로 막대 그래프 옵션
      setMonthlyChartOptions({
        chart: {
          type: 'bar',
          height: 400,
          toolbar: {
            show: true
          }
        },
        plotOptions: {
          bar: {
            horizontal: true,
            columnWidth: '55%',
            distributed: true
          }
        },
        tooltip: {
          custom: function({ seriesIndex, dataPointIndex, w }) {
            const category = w.globals.labels[dataPointIndex];
            const value = w.globals.series[0][dataPointIndex];
            
            // 해당 카테고리의 소분류 데이터 필터링
            const subcategoryData = projectTasks
              .filter(task => task.categoriesName === category)
              .reduce((acc, task) => {
                const subcategory = task.subcategoriesName || '미분류';
                if (!acc[subcategory]) {
                  acc[subcategory] = 0;
                }
                acc[subcategory] += parseFloat(task.spentTime) || 0;
                return acc;
              }, {});

            // 소분류 데이터를 시간 순으로 정렬
            const sortedSubcategories = Object.entries(subcategoryData)
              .sort(([, a], [, b]) => b - a)
              .map(([name, time]) => `${name}: ${time.toFixed(1)}h`);

            return `
              <div class="custom-tooltip">
                <div class="tooltip-title">${category}</div>
                <div class="tooltip-total">총 시간: ${value.toFixed(1)}h</div>
                <div class="tooltip-subcategories">
                  ${sortedSubcategories.join('<br>')}
                </div>
              </div>
            `;
          }
        },
        dataLabels: {
          enabled: true,
          formatter: function(value) {
            return `${value.toFixed(1)}h`;
          }
        },
        xaxis: {
          categories: sortedCategories.map(([category]) => category),
          title: {
            text: '소요시간 (시간)'
          },
          labels: {
            formatter: function(value) {
              // value가 숫자인지 확인하고, 아닐 경우 기본값 0으로 처리
              const numericValue = parseFloat(value) || 0; // 숫자가 아니면 0으로 변환
              return numericValue.toFixed(1);
              //return value.toFixed(1);
            }
          }
        },
        yaxis: {
          title: {
            text: '업무 카테고리'
          }
        },
        title: {
          text: `${projectName} - 업무 카테고리별 시간`,
          align: 'center'
        },
        legend: {
          show: false
        },
        colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#546E7A', '#26a69a', '#D10CE8']
      });
    }
  };

  return (
    <div className="totaladmin">
      <div className="refresh-button-container" style={{ padding: '10px', textAlign: 'right' }}>
        <button 
          onClick={handleRefresh}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          데이터 새로고침
        </button>
      </div>

      <div className="totaladmin-filters-container">
        <div className="totaladmin-filters-left">
          <select 
            name="project"
            value={filters.project}
            onChange={(e) => handleProjectFilter(e.target.value)}
            style={{ marginRight: '10px' }}
          >
            <option value="사업명">사업 선택</option>
            {projects.map((project) => (
              <option key={project.id} value={project.name}>
                {project.name}
              </option>
            ))}
          </select>
          <select 
            value={filters.employee} 
            onChange={(e) => handleFilterChange('employee', e.target.value)}
            disabled={filters.project !== '사업명'}
          >
            <option value="직원명">직원 선택</option>
            {employees.map((employee) => (
              <option key={employee} value={employee}>
                {employee}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
          />
          <span> ~ </span>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
          />
        </div>
      </div>

      <div className="totaladmin-charts">
        <div className="chart-container yearly-chart">
          <h3>2024년 연간 소요시간</h3>
          <Chart
            options={yearlyChartOptions}
            series={chartData.yearlyTotal.series}
            type="donut"
            height={300}
          />
        </div>
        <div className="chart-container monthly-chart">
          <h3>2024년 월별 소요시간</h3>
          <Chart
            options={monthlyChartOptions}
            series={chartData.monthlySeries}
            type="bar"
            height={400}
          />
        </div>
      </div>

      {selectedCategory && (
        <div className="category-filter-container">
          <div className="category-header">
            <h3>{filters.project} - {selectedCategory}</h3>
            <div className="subcategory-filter">
              <select 
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                className="subcategory-select"
              >
                {getSubcategories().map(subcategory => (
                  <option key={subcategory} value={subcategory}>
                    {subcategory}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      <DndProvider backend={HTML5Backend}>
        <div className="totaladmin-kanban-board" onScroll={handleScroll}>
          {['할일', '지연', '진행중', '완료'].map((status) => (
            <div key={status} className="totaladmin-kanban-column">
              <h3>{status} ({getFilteredTasks().filter(task => task.status === status).length})</h3>
              {getFilteredTasks()
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

      <div className="employee-stats-table">
        <h3>직원별 통계</h3>
        <table>
          <thead>
            <tr>
              <th>순위</th>
              <th>직원명</th>
              <th>첫 작성일</th>
              <th>마지막 작성일</th>
              <th>작성일수</th>
              <th>기준시간</th>
              <th>소요시간</th>
            </tr>
          </thead>
          <tbody>
            {calculateEmployeeStats().map((stats, index) => (
              <tr key={stats.name}>
                <td>{index + 1}</td>
                <td className={stats.isNewEmployee ? 'new-employee' : ''}>
                  {stats.name}
                </td>
                <td>{new Date(stats.firstTaskDate).toLocaleDateString()}</td>
                <td>{new Date(stats.lastTaskDate).toLocaleDateString()}</td>
                <td>{stats.workingDays}일</td>
                <td>{stats.standardTime.toFixed(1)}h</td>
                <td>{stats.totalSpentTime.toFixed(1)}h</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Totaladmin; 