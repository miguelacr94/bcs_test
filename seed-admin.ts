import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const uri = 'mongodb://127.0.0.1:27017/bcs_auth_db';
  console.log('Conectando a MongoDB:', uri);
  await mongoose.connect(uri);

  const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: 'CLIENT' },
    createdAt: { type: Date, default: Date.now },
    refreshToken: { type: String, default: null }
  });

  const UserModel = mongoose.models.User || mongoose.model('User', userSchema);

  const email = 'admin@bcs.com';
  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    console.log('El usuario admin ya existe.');
  } else {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('admin123', salt);

    const admin = new UserModel({
      name: 'Admin Principal',
      email,
      password: passwordHash,
      role: 'ADMIN'
    });

    await admin.save();
    console.log('Usuario admin creado exitosamente: admin@bcs.com / admin123');
  }

  await mongoose.disconnect();
}

bootstrap().catch(err => {
  console.error(err);
  process.exit(1);
});
