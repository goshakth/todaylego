import { useState } from 'react'
import React from 'react'
import './mypage.css'
import Graph2 from './Graph2'

function mypage() {

  const data2 =
  [
    {
      "id": "비대면",
      "label": "행사운영",
      "value": 30.6694757490469
    },
    {
      "id": "CRO",
      "label": "설문조사",
      "value": 15.193087406716861
    },
    {
      "id": "k-health",
      "label": "회의운영",
      "value": 9.4038613693771445
    },
    {
      "id": "k-health1",
      "label": "컨설팅",
      "value": 1.4038613693771445
    },
    {
      "id": "k-health3",
      "label": "전시회",
      "value": 2.4038613693771445
    },
    {
      "id": "k-health4",
      "label": "행정",
      "value": 13.4038613693771445
    },
    {
      "id": "k-healtht5",
      "label": "용역구매",
      "value": 8.4038613693771445
    },
    {
      "id": "k-healtht6",
      "label": "홍보",
      "value": 1.4038613693771445
    },
    {
      "id": "k-healtht7",
      "label": "수정",
      "value": 20.4038613693771445
    },
    {
      "id": "k-healtht8",
      "label": "검토",
      "value": 14.4038613693771445
    },
    {
      "id": "k-healtht9",
      "label": "기타_사업",
      "value": 17.4038613693771445
    },


  ]

  return (
    <>
      {/* <div style={{height:'1000px',width:'800px'}}>
        <Graph1 data={data}/>
      </div> */}

      <div style={{height:'800px',width:'500px'}}>
        <Graph2 data={data2}/>
      </div>
    </>
  )
}

export default mypage
