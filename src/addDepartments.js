import React from 'react';
import { db } from './firebase'; // Firebase 설정 파일 경로
import './AddDepartment.css'; // CSS 파일 추가

function AddDepartment() {
  const departmentData = {
    name: '사업부서',
    categories: [
      {
        id: 'category1',
        name: '대분류1',
        subcategories: [
          {
            id: 'subcategory1',
            name: '중분류1',
            subsubcategories: [
              { id: 'subsubcategory1', name: '소분류1' },
              { id: 'subsubcategory2', name: '소분류2' },
            ],
          },
          {
            id: 'subcategory2',
            name: '중분류2',
            subsubcategories: [
              { id: 'subsubcategory3', name: '소분류3' },
            ],
          },
        ],
      },
      {
        id: 'category2',
        name: '대분류2',
        subcategories: [],
      },
    ],
  };

  const addDepartmentData = () => {
    db.collection('departments')
      .doc('business')
      .set(departmentData)
      .then(() => console.log('Department data added successfully!'))
      .catch((error) => console.error('Error adding department data:', error));
  };

  return (
    <div className="add-department-container">
      <button className="add-department-button" onClick={addDepartmentData}>
        Add Department
      </button>
    </div>
  );
}

export default AddDepartment;
