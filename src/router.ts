import express from 'express'
import controller from './controllers'

const router = express.Router()

router.route(`/version`).get((req, res) => {
  res.send(require(`../package.json`).version)
})

router.route('/unitcode').post(controller.unitCode.create)
router.route('/unitcodes').get(controller.unitCode.list)
router.route('/unitcode').get(controller.unitCode.get)
router.route('/unitcode/:id').put(controller.unitCode.update)
router.route('/unitcode/:id').delete(controller.unitCode.del)

router.route('/properties').get(controller.property.listDistinct)

router.route('/login').post(controller.auth.login)

export default router
