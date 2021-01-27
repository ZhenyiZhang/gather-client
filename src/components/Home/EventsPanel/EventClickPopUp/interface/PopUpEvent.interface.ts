interface Contact {
  email: string;
  link: string;
  phone: string;
  location: string;
}

interface PopUpEvent {
  name: string;
  description: string;
  start: Date;
  end: Date;
  repeat: string;
  repeatEnds: Date;
  repeatNeverEnds: boolean;
  _id: string;
  Organization: string;
  contacts: Contact;
}

export default PopUpEvent;
