import React, { useState } from "react";
import { Card, Button, Modal, Toast, ToastContainer } from "react-bootstrap";
import expenseTypes from '../expenseTypes.json'

function BudgetCard({ data, setData, item }) {

  const [modalStatus, setModalStatus] = useState(false)

  const removeExpense = () => {
    const remove = data.filter(value => value.id !== item.id)
    setData([...remove])
  }

  const handleClose = () => setModalStatus(false)
  const handleOpen = () => setModalStatus(true)

  return (
    <>
      <Card className="card" style={{ width: "18rem" }}>
        {expenseTypes && expenseTypes.map(types => {
          if(types.value === item.place){
             return <Card.Img key={types.id} variant="top" className="card-image" src={types.image} />
          }
        })}
        <Card.Body className="card-body">
          <Card.Title>{item.place}</Card.Title>
          <Card.Title className="card-title">{item.price}₺</Card.Title>
          <Card.Title className="card-text">{item.createdDate}</Card.Title>
          <Card.Title className="card-text">{item.createdTime}</Card.Title>
          <Button variant="dark" onClick={handleOpen}>Sil</Button> 
        </Card.Body>
      </Card>

      {/* delete expense modal */}
      <Modal show={modalStatus} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Sil</Modal.Title>
        </Modal.Header>
        <Modal.Body>Harcamayı silmek istediğinizden emin misiniz?</Modal.Body>
        <Modal.Footer>
          <Button 
              variant="danger" 
              onClick={() =>(
                removeExpense(),
                handleClose()
            )}
          >
            Sil
          </Button>
          <Button variant="dark" onClick={handleClose}>
            Vazgeç
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default BudgetCard;
