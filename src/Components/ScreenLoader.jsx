import React from 'react'

export const ScreenLoader = () => {
    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '75vh' }}>
            <div className="spinner-border" style={{ color: '#ff6600' }} role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    )
}
export default ScreenLoader;
