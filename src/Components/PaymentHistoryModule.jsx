import React from 'react'
import { Link } from 'react-router-dom'

export const PaymentHistoryModule = ({ paymentData, emailIds }) => {
    return (
        <>
            <h2 className="text-3xl mb-4 heading">Payment history</h2>
            {paymentData.length === 0 ? (
                <div className="text-center text-muted my-5">
                    <p className="fs-6">Currently no <strong>Transaction’s</strong> available.</p>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table">
                        <thead className="table-dark" style={{ height: '60px' }}>
                            <tr>
                                <th className='align-middle' scope="col">Payment Id</th>
                                <th className='align-middle' scope="col">Email Id</th>
                                <th className='align-middle' scope="col">Payment date</th>
                                <th className='align-middle' scope="col">Price</th>
                                <th className='align-middle' scope="col">Payment Status</th>
                                {/* <th className='align-middle' scope="col">Order status</th> */}
                                {/* <th className='align-middle' scope="col"></th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {paymentData.map((pay) => (
                                <tr key={pay.paymentId}>
                                    <td scope='row'>{pay.paymentId}</td>
                                    <td>{pay.user.emailId || emailIds?.[pay?.user]}</td>
                                    <td>{new Date(pay.paymentDate).toLocaleString()}</td>
                                    <td>{pay.amount}</td>
                                    <td className={`fw-bold ${pay.paymentStatus === "Successful" ? 'text-success' : 'text-warning'}`}>{pay.paymentStatus}</td>
                                    {/* <td className={`fw-bold ${order.orderStatus === "Completed" ? 'text-success' : 'text-warning'}`}>{order.orderStatus}</td> */}
                                    {/* <td><Link to='#' className='btn button'>View</Link></td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    )
}
