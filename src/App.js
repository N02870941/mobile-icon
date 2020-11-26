import Header from './Header'
import Instructions from './Instructions'
import Form from './Form'
import Guidelines from './Guidelines'
import Footer from './Footer'
import Modal from './Modal'

export default function App() {
  return (
    <div className="container">
      <Header />
      <Form />
      <Instructions />
      <Guidelines />
      <Footer />
      <Modal />
    </div>
  );
};
