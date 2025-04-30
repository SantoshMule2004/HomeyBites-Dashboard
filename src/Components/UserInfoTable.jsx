import React from 'react'
import { Link } from 'react-router-dom'

export const UserInfoTable = ({ Users, navigateTo }) => {
    return (
        <div>
            {
                Users.length === 0 ? (
                    <div className="text-center text-muted my-5">
                        <p className="fs-6">No <strong>User’s</strong> present.</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table">
                            <thead className="table-dark" style={{ height: '60px' }}>
                                <tr>
                                    <th className='align-middle' scope="col">User Id</th>
                                    <th className='align-middle' scope="col">Name</th>
                                    <th className='align-middle' scope="col">Email Id</th>
                                    <th className='align-middle' scope="col">Contact No.</th>
                                    <th className='align-middle' scope="col">Gender</th>
                                    <th className='align-middle' scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {Users.map((user) => (
                                    <tr key={user.userId}>
                                        <td scope='row'>{"HB" + user.userId}</td>
                                        <td>{user.firstName + " " + user.lastName}</td>
                                        <td>{user.emailId}</td>
                                        <td>{user.phoneNo}</td>
                                        <td>{user.gender}</td>
                                        <td><Link to={navigateTo} className='btn button fw-bold text-secondary' onClick={()=> localStorage.setItem("singleUserId", user.userId)}>View Info</Link></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            }
        </div>
    )
}
