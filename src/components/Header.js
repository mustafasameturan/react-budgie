import React, { useEffect, useState } from 'react'
import { isValidQuantityInput, isValidExpensePrice, moneyFormat } from '../helpers'
import { Alert, Button, Modal, InputGroup, Form, Toast, ToastContainer } from 'react-bootstrap'
import expenseTypes from '../expenseTypes.json'
import nanoId from 'nano-id'

function Header({ total, data, setData }) {

  const [modalStatus, setModalStatus] = useState(false)
  const [resetModalStatus, setResetModalStatus] = useState(false)
  const [addModalStatus, setAddModalStatus] = useState(false)
  const [toastStatus, setToastStatus] = useState(false)
  
  const [disabled, setDisabled] = useState(true)
  const [addDisabled, setAddDisabled] = useState(true)

  const [money, setMoney] = useState(0)
  const [currentMoney, setCurrentMoney] = useState(0)

  const [expensePrice, setExpensePrice] = useState(0)
  const [expensePlace, setExpensePlace] = useState('Diğer')
  const [createdDate, setCreatedDate] = useState()
  const [createdTime, setCreatedTime] = useState()

  //edit money modal
  const handleClose = () => setModalStatus(false)
  const handleOpen = () => setModalStatus(true)
  const handleChange = (e) => {
    const valid = isValidQuantityInput(e.target.value)
    const validExpensePrice = isValidExpensePrice((total), e.target.value)
    valid && validExpensePrice
        ? setDisabled(false) 
        : setDisabled(true)
    setMoney(e.target.value)
  }
  const handleClick = () => {
    localStorage.setItem('myMoney', money)
    setDisabled(true)
  }

  //reset modal
  const handleCloseReset = () => setResetModalStatus(false)
  const handleOpenReset = () => setResetModalStatus(true)
  const handleClickReset = () => {
    setData([])
  }
  
  //add modal
  const handleCloseAdd = () => setAddModalStatus(false)
  const handleOpenAdd = () => setAddModalStatus(true)
  const handleAddChange = (e) => {
    const valid = isValidQuantityInput(e.target.value)
    valid && currentMoney-(total+parseInt(e.target.value))>=0
        ? setAddDisabled(false)
        : setAddDisabled(true)
    setExpensePrice(parseInt(e.target.value))
  }
  const handleExpensePlaceChange = (e) => {
    setExpensePlace(e.target.value)
  }

  useEffect(() => {
    const currentDateAndTime = () => {
        let date = new Date()
        let twoDigitMonth = `0${date.getMonth() + 1}`.slice(-2);
        let twoDigitDay = `0${date.getDay() + 1}`.slice(-2)
        let twoDigitMinutes = `0${date.getMinutes() + 1}`.slice(-2) 
        let currentDate = twoDigitDay + '-' + twoDigitMonth + '-' + date.getFullYear()
        let currentTime = date.getHours() + ':' + twoDigitMinutes
    
        setCreatedDate(currentDate)
        setCreatedTime(currentTime)
    }
    currentDateAndTime()
  },[data])

  useEffect(() => {
    const loadCurrentMoneyFromLocalStorage = () => {
        const storedMoney = JSON.parse(localStorage.getItem('myMoney'));
        storedMoney !== null ? setCurrentMoney(parseInt(storedMoney)) : setCurrentMoney(0)
    }

    loadCurrentMoneyFromLocalStorage()
  })

  const addExpense = () => {
    setData([...data, {
        id: nanoId(),
        price: expensePrice,
        place: expensePlace,
        createdDate: createdDate,
        createdTime: createdTime
    }])
    setAddDisabled(true)
  }
  
  return (
    <>
        <div className='mt-2'>
            <Alert variant='success'>
                {currentMoney === 0 && !currentMoney && (
                    <Alert.Heading className='text-center'>Harcayacak paranız yok. 'Paramı Düzenle' kısmından bakiyenizi belirleyiniz.</Alert.Heading>
                )}
                {currentMoney !== 0 && total > 0 && currentMoney-total > 0 && (
                    <Alert.Heading className='text-center'>Harcayacak {moneyFormat(currentMoney-total)}₺ var.</Alert.Heading>
                )}
                {currentMoney !== 0 && data.length === 0 && (
                    <Alert.Heading className='text-center'>Harcayacak {moneyFormat(currentMoney)}₺ var.</Alert.Heading>
                )}
                {currentMoney !== 0 && currentMoney === total && (
                    <Alert.Heading className='text-center'>Paranız kalmadı.</Alert.Heading>
                )}
                <hr />
                <div className='text-center d-flex justify-content-center gap-2'>
                    <Button variant='dark' onClick={handleOpenAdd}>Harcama Ekle</Button>
                    <Button variant='dark' onClick={handleOpen}>Paramı Düzenle</Button>
                    <Button variant='dark' onClick={handleOpenReset}>Sıfırla</Button>
                </div>
            </Alert>
        </div>
        
        {/* edit money modal */}
        <Modal show={modalStatus} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Para Düzenleme Ekranı</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <InputGroup className="mb-3">
                    <InputGroup.Text>₺</InputGroup.Text>
                    <Form.Control placeholder={moneyFormat(currentMoney)} onChange={handleChange}/>
                </InputGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button 
                    disabled={disabled} 
                    variant="dark" 
                    onClick={() =>(
                        handleClick(),
                        handleClose()
                    )}
                >
                    Kaydet
                </Button>
                <Button 
                    variant='danger'
                    onClick={handleClose}
                >
                    Kapat
                </Button>
            </Modal.Footer>
        </Modal>

        {/* reset modal */}
        <Modal show={resetModalStatus} onHide={handleCloseReset} centered>
            <Modal.Header closeButton>
                <Modal.Title>Sıfırla</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Harcamalarınızı sıfırlamak istediğinizden emin misiniz?
            </Modal.Body>
            <Modal.Footer>
                <Button 
                    variant="dark" 
                    onClick={() =>(
                        handleClickReset(),
                        handleCloseReset()
                    )}
                >
                    Evet
                </Button>
                <Button 
                    variant='danger'
                    onClick={handleCloseReset}
                >
                    Kapat
                </Button>
            </Modal.Footer>
        </Modal>

        {/* add modal */}
        <Modal show={addModalStatus} onHide={handleCloseAdd} centered>
            <Modal.Header closeButton>
                <Modal.Title>Harcama Ekleme</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <InputGroup className="mb-3">
                    <InputGroup.Text>Harcama Miktarı</InputGroup.Text>
                    <Form.Control onChange={handleAddChange}/>
                </InputGroup>
                <Form.Select aria-label="Default select example" onChange={handleExpensePlaceChange}>
                    <option>Harcama yaptığınız yeri seçiniz...</option>
                    {expenseTypes && expenseTypes.map(types => (
                        <option key={types.id} value={types.value}>{types.value}</option>
                    ))}
                </Form.Select>
            </Modal.Body>
            <Modal.Footer>
                <Button 
                    disabled={addDisabled} 
                    variant="dark" 
                    onClick={() =>(
                        addExpense(),
                        handleCloseAdd(),
                        setToastStatus(true)
                    )}
                >
                    Kaydet
                </Button>
                <Button 
                    variant='danger'
                    onClick={handleCloseAdd}
                >
                    Kapat
                </Button>
            </Modal.Footer>
        </Modal>

        {/* add succeded toast */}
        <ToastContainer position="bottom-end" className="p-3">
            <Toast onClose={() => setToastStatus(false)} show={toastStatus} bg="success" delay={2000} autohide>
                <Toast.Header>
                    <img
                    src="holder.js/20x20?text=%20"
                    className="rounded me-2"
                    alt=""
                    />
                    <strong className="me-auto">Harcama Eklendi</strong>
                    <small className="text-muted">{new Date().getSeconds()} saniye önce</small>
                </Toast.Header>
                <Toast.Body>Harcama başarıyla eklendi.</Toast.Body>
            </Toast>
        </ToastContainer>
    </>
  )
}

export default Header