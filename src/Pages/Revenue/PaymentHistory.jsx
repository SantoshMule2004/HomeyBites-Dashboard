import React, { useEffect, useState } from 'react'
import ScreenLoader from '../../Components/ScreenLoader';
import { PaymentHistoryModule } from '../../Components/PaymentHistoryModule';
import { useUserInfo } from '../../Context/UserContext'
import { getAllPaymentDataOfProvider } from '../../Services/PaymentService';
import { useOrderData } from '../../Context/OrderContext';

export const PaymentHistory = () => {
    const [loading, setLoading] = useState(true);

    const { getPaymentForOrders, setPaymentForOrders, getPaymentEmailIds, setPaymentEmails } = useOrderData();

    const { getUserInfo } = useUserInfo();
    const user = getUserInfo();

    const [paymentData, setPaymentData] = useState([]);

    const [emailIds, setEmailIds] = useState({});

    const loadPaymentData = () => {
        setLoading(true);
        if (getPaymentForOrders() == null) {
            getAllPaymentDataOfProvider(user.userId).then((response) => {
                setPaymentData(response);
                setPaymentForOrders(response);
                const payment = response;
                const map = {};
                payment.forEach(pay => {
                    if (typeof pay.user === 'object' && pay.user !== null && 'userId' in pay.user) {
                        console.log("inside order")
                        map[pay.user.userId] = pay?.user?.emailId; // Stores unique email ids
                    }
                });

                setEmailIds(map);
                setPaymentEmails(map);

                setLoading(false);
            }).catch((error) => {
                setLoading(false);
                console.log(error);
            })
        } else {
            setLoading(false);
            setEmailIds(getPaymentEmailIds());
            setPaymentData(getPaymentForOrders());
        }
    }

    useEffect(() => {
        loadPaymentData();
    }, [])

    return (
        <div className='container mt-5 p-2'>
            {loading ? (
                <ScreenLoader />
            ) : (
                <>
                    <PaymentHistoryModule paymentData={paymentData} emailIds={emailIds} />
                </>)}
        </div>
    )
}
