import Container from 'react-bootstrap/Container'
import Header from './Header'
import Form from './Form'
import Guidelines from './Guidelines'
import Footer from './Footer'
import Modal from './Modal'

export default function App() {
  return (
    <Container>
      <Header />
      <Form />
      <Guidelines />
      <Footer />
      <Modal />
    </Container>
  );
};
