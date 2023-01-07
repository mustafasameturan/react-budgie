import "./App.css"
import { useEffect, useState } from "react";
import { Col, Container, Row, Image } from "react-bootstrap";
import { Header, BudgetCard } from "./components";

function App() {
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadFromLocaleStorage = () => {
      const storedData = localStorage.getItem("data");
      setData(JSON.parse(storedData));
    };
    loadFromLocaleStorage();
  }, []);

  useEffect(() => {
    setTotal(
      data.reduce((acc, item) => {
        return acc + item.price;
      }, 0)
    );
    
    const saveToLocaleStorage = () => {
      localStorage.setItem("data", JSON.stringify(data));
    };
    saveToLocaleStorage();
  }, [data]);

  return (
      <>
        <Container>
          <Header
            total={total}
            data={data}
            setData={setData}
          />
          {data && data.length === 0 && (
            <div className="d-flex align-items-centers justify-content-center">
              <Image className="mt-5" src="https://iili.io/Hxv9Zj2.png" width={390} height={390} />
            </div>
          )}
          <Row>
            {data &&
              data.map((item) => (
                <Col key={item.id} className="card-center mb-3 text-center">
                  <BudgetCard data={data} setData={setData} item={item} />
                </Col>
              ))}
          </Row>
        </Container>
      </>
  );
}

export default App;
