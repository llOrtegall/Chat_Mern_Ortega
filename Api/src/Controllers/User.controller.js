import { UserModel } from '../../models/User.js'
import jwt from 'jsonwebtoken'
import bycrypt from 'bcryptjs'
import env from 'dotenv'

env.config()

const JWT_SECRET = process.env.JWT_SECRET
const bcryptSalt = bycrypt.genSaltSync(10)

export const profile = async (req, res) => {
  const token = req.cookies?.token;
  if (token) {
    jwt.verify(token, JWT_SECRET, {}, (err, userData) => {
      if (err) throw err;
      res.json(userData)
    })
  } else {
    res.status(401).json({ message: 'Unauthorized' })
  }
}

export const people = async (req, res) => {
  const users = await UserModel.find({}, { '_id': 1, 'username': 1 })
  res.json(users);
}

export const login = async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    res.status(400).json({ message: 'El Usuario y/o Contraseña Son Requeridos' })
    return
  }
  const foundUser = await UserModel.findOne({ username })
  try {
    if (foundUser) {
      const passOk = bycrypt.compareSync(password, foundUser.password)
      if (passOk) {
        jwt.sign({ userId: foundUser._id, username }, JWT_SECRET, { expiresIn: '20m' }, (err, token) => {
          if (err) throw err;
          res.cookie('token', token, { sameSite: 'none', secure: true }).status(200).json({
            id: foundUser._id, username: foundUser.username, token
          })
        })
      } else {
        res.status(401).json({ message: 'Clave Invalida' })
      }
    } else {
      res.status(404).json({ message: 'Usuario No Existe' })
    }
  } catch (error) {
    res.status(500).json({ message: error })
  }
}

export const register = async (req, res) => {
  console.log(req.body)
  const { username, password } = req.body;
  try {
    const hashedPassword = bycrypt.hashSync(password, bcryptSalt)
    const createdUser = await UserModel.create({
      username: username,
      password: hashedPassword
    })
    jwt.sign({ userId: createdUser._id, username }, JWT_SECRET, {}, (err, token) => {
      if (err) {
        res.status(500).json({ message: 'Internal server error', error: err })
      }
      res.cookie('token', token, { sameSite: 'none', secure: true }).status(201).json({
        id: createdUser._id
      })
    })
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err })
    console.log(err)    
  }
}
