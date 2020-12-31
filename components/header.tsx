import React from "react"
import { LeftOutlined } from "@ant-design/icons"

const Header = () => {
  return (
    <>
      <div className="header">
        <LeftOutlined
          onClick={() => {
            window.history.go(-1)
          }}
        />
      </div>
      <style jsx>{`
        .header {
          padding: 20px 10px 0;
          font-size: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 32px;
        }
      `}</style>
    </>
  )
}

export default Header
