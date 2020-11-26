import Header from './Header'
import Instructions from './Instructions'
import Form from './Form'
import GeneralGuidelines from './GeneralGuidelines'
import AppleGuidelines from './AppleGuidelines'
import AndroidGuidelines from './AndroidGuidelines'
import Footer from './Footer'
import Modal from './Modal'

export default function App() {
  return (
    <div className="container">
      <Header />
      <Form />
      <Instructions />
      <GeneralGuidelines />
      <AppleGuidelines />
      <AndroidGuidelines />
      <Footer />
      <Modal />
    </div>
  );
};
