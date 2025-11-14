import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Gtastr from '../assets/ggta.png'

function BasicExample() {
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src={ Gtastr} />
      <Card.Body>
        <Card.Title>GTA-VI </Card.Title>
        <Card.Text>
          🚗💥 Unleash GTA 6 vibes! Peel, stick on laptops, phones, bikes, or notebooks, and let your style reflect. 💎 Premium DTF | Waterproof | Scratchproof. 🛒 Grab & flex now!
        </Card.Text>
        <Button variant="primary">Add to cart</Button>
      </Card.Body>
    </Card>
  );
}

export default BasicExample;