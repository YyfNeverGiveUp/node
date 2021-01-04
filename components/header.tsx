import React from "react"
import { LeftOutlined } from "@ant-design/icons"

type Header = {
  title?:string
}

const Header = (props:Header) => {
  const {title} = props
  return (
    <>
      <div className="header">
        <LeftOutlined
          onClick={() => {
            window.history.go(-1)
          }}
        />
        <div className="title">{title || ""}</div>
      </div>
      <style jsx>{`
        .header {
          padding: 20px 10px 0;
          font-size: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 32px;
          text-align: center;
          position: relative;
        }
        .header > .title {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -30%);
        }
      `}</style>
    </>
  )
}

export default Header
