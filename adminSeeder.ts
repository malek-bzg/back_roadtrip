const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

const adminData = {
  password: 'adminpassword', // Vous devriez utiliser un système de hachage pour stocker le mot de passe dans une vraie application
  Fname: 'Med Malek', // Remplacez cette valeur par le prénom que vous souhaitez pour l'administrateur
  Lname: 'Bouzgarrou', // Ajoutez le nom de famille que vous souhaitez pour l'administrateur
  phone_number: '58301255', // Ajoutez le numéro de téléphone que vous souhaitez pour l'administrateur
  email: 'malek.bouz2@gmail.com',
  role: 'Admin',
  profilePicture: '/uploads/images/profilePicture-1690793071481-847973903.jpg'
};

async function seedAdmin() {
  try {
    const admin = await prisma.user.create({
      data: adminData,
    });

    console.log('Admin créé avec succès :', admin);
    const token = jwt.sign({ id: admin.id, role: admin.role }, 'votre_secret_key');
    console.log('Token d\'authentification pour l\'administrateur :', token);
  } catch (error) {
    console.error('Erreur lors de la création de l\'admin :', error);
  } finally {
    await prisma.$disconnect(); // Déconnectez-vous de la base de données une fois terminé
  }
}

seedAdmin();
