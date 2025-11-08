// src/routes/user.route.js
import { Router } from 'express'
import { auth } from '../middlewares/auth.js'   // chỉ dùng 1 middleware
import User from '../models/user.js'

const router = Router()

// GET /api/user/me  (yêu cầu JWT)
router.get('/me', auth(), async (req, res) => {
  try {
    // auth() đã gắn req.userId và req.userRole
    const user = await User.findById(req.userId).select('-password')
    if (!user) {
      return res.status(404).json({ errCode: 404, message: 'User not found' })
    }
    return res.json({ errCode: 0, user })
  } catch (e) {
    console.error('GET /user/me error:', e)
    return res.status(500).json({ errCode: 500, message: 'Server error' })
  }
})

export default router
