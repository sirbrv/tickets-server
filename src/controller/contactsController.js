const fs = require("fs").promises;
const contactsFile = "src/json/contacts.json";

//**************************************************** */
//     Busca de datos generales del archivo json        //
//**************************************************** */

const getContacts = async (req, res) => {
  try {
    const datos = await fs.readFile(contactsFile, "utf-8");
    const contacts = JSON.parse(datos);
    res.send({ data: contacts, message: "Consulta exitosa" }).status(200);
    return;
  } catch (error) {
    console.log(error);
  }
};

//**************************************************** */
//     Busca de registro por id archivo json           //
//**************************************************** */

const getContact = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const datos = await fs.readFile(contactsFile, "utf-8");
    const contacts = JSON.parse(datos);
    const contact = contacts.find((item) => item.id === id);
    if (contact) {
      res.send({ data: contact, message: "Consulta exitosa" }).status(200);
    } else {
      res.send({ message: "El registro indicado no existe" }).status(400);
    }
    return;
  } catch (error) {
    console.log(error);
  }
};

//**************************************************** */
//     Eliminación de registro por id archivo json     //
//**************************************************** */

const delContact = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const datos = await fs.readFile(contactsFile, "utf-8");
    const contacts = JSON.parse(datos);
    const index = contacts.findIndex((item) => item.id === id);
    if (index >= 0) {
      contacts.splice(index, 1);
      await fs.writeFile(contactsFile, JSOn.stringify(contacts));
      res.send({ message: "Registro Eliminado exitosamente" }).status(200);
    } else {
      res.send({ message: "El registro indicado no existe" }).status(400);
    }
    return;
  } catch (error) {
    console.log(error);
  }
};

//**************************************************** */
//          Se crea registro en archivo json           //
//**************************************************** */

const AddContact = async (req, res) => {
  console.log("Registro entrante.....:", req.body);
  const newContact = {
    id: parseInt(req.body.id),
    nombre: req.body.nombre,
    email: req.body.email,
    descripcion: req.body.descripcion,
  };

  try {
    const datos = await fs.readFile(contactsFile, "utf-8");
    const contcoacts = JSON.parse(datos);
    // const contact = contcoacts.find((item) => item.id === id);
    newContact.id = getNextId(contcoacts);
    contcoacts.push(newContact);
    await fs.writeFile(contactsFile, JSON.stringify(contcoacts));
    res.send({ data: newContact, message: "Registro Creado" }).status(201);
    return;
  } catch (error) {
    console.log(error);
  }
};

//**************************************************** */
//          Se actualiza registro en archivo json           //
//**************************************************** */

const upDateContact = async (req, res) => {
  console.log("Registro entrante.....:", req.body);
  const id = parseInt(req.params.id);
  const newContact = {
    id: parseInt(req.body.id),
    nombre: req.body.nombre,
    email: req.body.email,
    descripcion: req.body.descripcion,
  };
  try {
    const datos = await fs.readFile(contactsFile, "utf-8");
    const contacts = JSON.parse(datos);
    const index = contacts.findIndex((item) => item.id === id);
    if (index >= 0) {
      contacts[index] = newContact;
      await fs.writeFile(contactsFile, JSON.stringify(contacts));
      res.send({ message: "Registro Actualiza" }).status(200);
    } else {
      res.send({ message: "El registro indicado no existe" }).status(400);
    }
    return;
  } catch (error) {
    console.log(error);
  }
};

function getNextId(data) {
  if (data.length === 0) {
    return 1;
  }
  const maxId = Math.max(...data.map((item) => item.id));
  return maxId + 1;
}

module.exports = {
  getContacts,
  getContact,
  delContact,
  AddContact,
  upDateContact,
};
