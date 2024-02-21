import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import * as api from '../../../../api'
import Button from '../../../../components/bootstrap/Button'
import Card, { CardBody, CardHeader, CardLabel, CardTitle } from '../../../../components/bootstrap/Card'
import Page from '../../../../layout/Page/Page'
import PageWrapper from '../../../../layout/PageWrapper/PageWrapper'
import { setAlert } from '../../../../globalState/action-creators'
import Select from '../../../../components/bootstrap/forms/Select'

const ChangeRates = () => {

  const [partnersData, setpartnersData] = useState([])
  const [partnerId, setpartnerId] = useState('')

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  useEffect(
    () => {
      if (!token) {
        navigate('/auth-pages/login', { replace: true })
      }
      fetchPartners()
      // eslint-disable-next-line
    }, []
  )

  const [formData, setFormData] = useState(
    {
      name: "",
      type: "",
      description: "",
      price: "",
      partnerId: ""
    }
  );

  const fetchPartners = async () => {
    try {
      const { data: { partners, success } } = await api.getPartners();
      if (success && partners && partners.length > 0) {
        setpartnerId(partners[0]._id)
        const optionArray = []
        partners && partners.map((partner, i) => {
          optionArray.push({ value: partner._id, text: partner.partnerName })
          return null
        })
        setpartnersData(optionArray)
      }
    } catch (error) {
      dispatch(setAlert(error.message, "Error"))
    };
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setpartnerId(value)
    setFormData(
      {
        ...formData,
        [name]: value
      }
    )
  }

  // ADD RATE
  const addRate = async () => {
    try {
      const { data } = await api.addRate(formData);
      if (data.success) {
        navigate('/rates')
        dispatch(setAlert(data.message, "Success"))
      } else {
        dispatch(setAlert(data.message, "Error"))
      }
    } catch (error) {
      dispatch(setAlert(error.message, "Error"))
    }
  }

  const validationError = (elementId, msg, showElemmentId) => {
    const el = document.getElementById(elementId)
    const spanEl = document.getElementById(showElemmentId)
    if (el.value.length >= 0) {
      el.addEventListener('input', () => {
        if (el.value.length === 0) {
          spanEl.style.opacity = '0'
        }
        else if (el.name === "price" && el.value / el.value !== 1) {
          spanEl.style.opacity = '1';
          spanEl.innerText = `Please enter a valid ${msg}!`
        }
      })
    }
  }

  const validationErrors = () => {
    validationError("price", "Price", "priceSpan")
  }

  useEffect(
    () => {
      validationErrors()
      // eslint-disable-next-line
    }, []
  )

  return (
    <PageWrapper title="Add Rate">
      <Page container="fluid">
        <div className="row">
          <div className="col-xxl-6">
            <Card stretch>
              <CardHeader>
                <CardLabel icon="Plus" iconColor="dark">
                  <CardTitle tag="h4" className="h5">
                    Add Rate
                  </CardTitle>
                </CardLabel>
              </CardHeader>
              <CardBody>
                <div className="row">
                  <div className="col-sm-12 col-md-4">
                    <div className="card-body card-info">
                      <div className="card-info-item">
                        <div className="label">
                          <p className='changeRatesBtnPTagPadding'>
                            Name
                          </p>
                        </div>
                        <div className="data">
                          <input type="text"
                            className='form-control'
                            autoComplete='off'
                            onChange={onChange}
                            name="name"
                            style={styles.inputStyles} />
                        </div>
                      </div>
                      <br />
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-4">
                    <div className="card-body card-info">
                      <div className="card-info-item">
                        <div className="label">
                          <p className='changeRatesBtnPTagPadding'>Type</p>
                        </div>
                        <div className="data">
                          <input type="text"
                            className='form-control'
                            onChange={onChange}
                            autoComplete='off'
                            name="type"
                            style={styles.inputStyles} />
                        </div>
                      </div>
                      <br />
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-4">
                    <div className="card-body card-info">
                      <div className="card-info-item">
                        <div className="label">
                          <p className='changeRatesBtnPTagPadding'>Description</p>
                        </div>
                        <div className="data">
                          <input type="text"
                            className='form-control'
                            onChange={onChange}
                            autoComplete='off'
                            name="description"
                            style={styles.inputStyles} />
                        </div>
                      </div>
                      <br />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-12 col-md-4">
                    <div className="card-body card-info">
                      <div className="card-info-item">
                        <div className="label">
                          <p className='changeRatesBtnPTagPadding'>Price</p>
                        </div>
                        <div className="data">
                          <input type="text"
                            id='price'
                            className='form-control'
                            onChange={onChange}
                            name="price"
                            autoComplete='off'
                            style={styles.inputStyles} />
                          <span id="priceSpan" style={{ position: 'absolute', opacity: 0, color: "crimson" }}></span>
                        </div>
                      </div>
                      <br />
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-4">
                    <div className="card-body card-info">
                      <div className="card-info-item">
                        <div className="label">
                          <p className='changeRatesBtnPTagPadding'>Partner</p>
                        </div>
                        <div className="data">
                          <Select
                            ariaLabel='Default select example'
                            placeholder=' '
                            value={partnerId}
                            style={{ boxShadow: 'rgb(116 116 116 / 53%) 0px 0px 1px 1px inset' }}
                            name="partnerId"
                            onChange={(e) => { onChange(e) }}
                            list={partnersData}
                            className="addVehicleSelect inputBoxShadow"
                          />
                        </div>
                      </div>
                      <br />
                    </div>

                  </div>
                </div>
                <Button
                  className="mt-3"
                  color='dark'
                  isDisable={
                    formData?.name?.length <= 0 ||
                    formData?.type?.length <= 0 ||
                    formData?.price?.length <= 0 ||
                    formData?.description?.length <= 0 ||
                    formData?.partnerId?.length <= 0
                  }
                  onClick={() => addRate()}>
                  Save
                </Button>
                <Button
                  className="mt-3 mx-2"
                  color='danger'
                  onClick={() => navigate('/rates')}>
                  Cancel
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </Page>
    </PageWrapper>
  )
}

const styles = {
  inputStyles: {
    boxShadow: 'rgb(116 116 116 / 53%) 0px 0px 1px 1px inset',
    lineHeight: '1.5',
    padding: "0.5rem 3rem 0.5rem 1rem",
    height: "3.5rem"
  }
}

export default ChangeRates