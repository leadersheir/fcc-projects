import React, { useState, useEffect } from "react";
import "./styles.scss";
import { Container, Button, Card, CardBody, CardText } from "reactstrap";

export default function App() {
  const [author, setAuthor] = useState("");
  const [quote, setQuote] = useState("");

  const getQuote = () => {
    fetch("https://thesimpsonsquoteapi.glitch.me/quotes")
      .then((res) => res.json())
      .then((data) => {
        setAuthor(data[0].character);
        setQuote(data[0].quote);
      });
  };

  useEffect(() => {
    getQuote();
  }, []);

  return (
    <div
      className="App"
      style={{ background: "linear-gradient(45deg, #0A8270, #7CFF6B)" }}
    >
      <Container
        style={{ display: "flex", justifyContent: "center" }}
        fluid={true}
      >
        <Card style={{ maxWidth: 600 }} id="quote-box">
          <CardBody>
            <CardText id="text">{quote}</CardText>
            <em id="author" style={{ color: "gray" }}>
              {author}
            </em>
          </CardBody>
          <div className="btn-container">
            <Button
              onClick={getQuote}
              style={{ width: "90px", margin: "0px 5px 10px 20px" }}
              id="new-quote"
              color="secondary"
              size="sm"
            >
              New Quote
            </Button>
            <a
              id="tweet-quote"
              style={{ marginRight: 20, marginLeft: 5 }}
              href="https://twitter.com/intent/tweet"
            >
              Tweet
            </a>
          </div>
        </Card>
      </Container>
    </div>
  );
}
