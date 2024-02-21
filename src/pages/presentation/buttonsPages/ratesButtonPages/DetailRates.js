import React, { useEffect, useState } from 'react'
import _ from 'lodash'
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import * as api from '../../../../api'
import Card, { CardBody, CardHeader, CardLabel, CardTitle } from '../../../../components/bootstrap/Card'
import Page from '../../../../layout/Page/Page'
import PageWrapper from '../../../../layout/PageWrapper/PageWrapper'
import {setAlert, setLoading} from '../../../../globalState/action-creators'

const DetailRates = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [rate, setRate] = useState('')

    const token = localStorage.getItem('token');
    useEffect(
        () => {
            if (!token) {
                navigate('/auth-pages/login', { replace: true })
            }
            fetchRate(id)
            // eslint-disable-next-line
        }, []
    )
    const fetchRate = async (id) => {
        dispatch(setLoading(true))
        try {
            const { data } = await api.getRateById(id);
            if (data.success) {
                setRate(_.get(data, 'rates', {...rate}))
            }
            else {
                dispatch(setAlert(data.message, "Error"))
            }
        } catch (error) {
            dispatch(setAlert(error.message, "Error"))
        }
        dispatch(setLoading(false))
    }
    return (
        <PageWrapper title="Detail">
            <Page container="fluid">
                <div className="row">
                    <div className="col-xxl-6">
                        <Card stretch>
                            <CardHeader>
                                <CardLabel icon="Rates" iconColor="dark">
                                    <CardTitle tag="h4" className="h5">
                                        Rates Detail
                                    </CardTitle>
                                </CardLabel>
                            </CardHeader>
                            <CardBody>
                                <div className="row">
                                    <div className="col-sm-12 col-md-4">
                                        <div className="card-body card-info">
                                            <div className="card-info-item">
                                                <div className="label">
                                                    <p>
                                                        <strong>
                                                            NAME
                                                        </strong>
                                                    </p>
                                                </div>
                                                <div className="data">
                                                    <p>
                                                        <strong style={{ color: 'rgb(112 110 110)' }}>
                                                            {_.get(rate, 'name', '')}
                                                        </strong>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-4">
                                        <div className="card-body card-info">
                                            <div className="card-info-item">
                                                <div className="label">
                                                    <p>
                                                        <strong>
                                                            TYPE
                                                        </strong>
                                                    </p>
                                                </div>
                                                <div className="data">
                                                    <p>
                                                        <strong style={{ color: 'rgb(112 110 110)' }}>
                                                            {_.get(rate, 'type', '')}
                                                        </strong>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-4">
                                        <div className="card-body card-info">
                                            <div className="card-info-item">
                                                <div className="label">
                                                    <p>
                                                        <strong>
                                                            DESCRIPTION
                                                        </strong>
                                                    </p>
                                                </div>
                                                <div className="data">
                                                    <p>
                                                        <strong style={{ color: 'rgb(112 110 110)' }}>
                                                            {_.get(rate, 'description', '')}
                                                        </strong>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12 col-md-4">
                                        <div className="card-body card-info">
                                            <div className="card-info-item">
                                                <div className="label">
                                                    <p>
                                                        <strong>
                                                            PRICE
                                                        </strong>
                                                    </p>
                                                </div>
                                                <div className="data">
                                                    <p>
                                                        <strong style={{ color: 'rgb(112 110 110)' }}>
                                                            $ {_.get(rate, 'price', '')}
                                                        </strong>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-4">
                                        <div className="card-body card-info">
                                            <div className="card-info-item">
                                                <div className="label">
                                                    <p>
                                                        <strong>
                                                            PARTNER
                                                        </strong>
                                                    </p>
                                                </div>
                                                <div className="data">
                                                    <p>
                                                        <strong style={{ color: 'rgb(112 110 110)' }}>
                                                            {_.get(rate, 'partner.partnerName', '')}
                                                        </strong>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </Page>
        </PageWrapper>
    )
}

export default DetailRates