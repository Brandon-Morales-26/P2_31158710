require(`dotenv`).config()
const ContactosModel = require("../models/ContactosModel");
const nodemailer = require("nodemailer");

class ContactosController {

  async obtenerIp() {
    try {
      const response = await fetch(`https://api.ipify.org?format=json`);
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error(`Error al obtener la ip:` , error);
      return null;
    }
  }
  
  async obtenerPais(ip) {
    try {
      const response = await fetch(`https://ipinfo.io/`+ip+`?token=f22a0daa5f056d`);
      const data = await response.json();
      return data.country;
    } catch (error) {
      console.error(`Error al obtener el pais:` , error);
      return null;
    }
  }

  
  

  


  constructor() {
    this.contactosModel = new ContactosModel();
    this.add = this.add.bind(this);
  }

  async add(req, res) {

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, // Use port 465 for SSL
      secure: true, // Set to true for SSL
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const sendTemplate = {
      from: process.env.USER, //correo de ejemplo
      to: [process.env.EMAILRECP1],
      subject: "Registro de la pagina",
      text: `Nombre: ${req.body.name} 
      | Email: ${req.body.email} | mensaje: ${req.body.mensaje}
      | Date: ${new Date()}`
    };

    transporter.sendMail(sendTemplate, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent successfully:", info.response);
      }
    });
  
  

    // Validar los datos del formulario

    const { email, name, mensaje } = req.body;

    if (!email || !name || !mensaje) {
      res.status(400).send("Faltan campos requeridos");
      return;
    }

    // Guardar los datos del formulario
    const ip = await this.obtenerIp();
    const fecha = new Date().toISOString();
    const pais = await this.obtenerPais(ip);

   
    await this.contactosModel.crearContacto(email, name, mensaje, ip, fecha, pais);

    const contactos = await this.contactosModel.obtenerAllContactos();

    console.log(contactos);

    // Redireccionar al usuario a una página de confirmación
  

    try{
      res.status(200).send("El formulario se ha cargado correctamente.");
    } catch (error){
      res.status(500).send("Ha ocurrido un error,intentelo nuevamente.");
    }
  }
}



module.exports = ContactosController;

