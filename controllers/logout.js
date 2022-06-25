const { QueryTypes} = require('sequelize')
const { ActiveSessions } = require('../models')
const { tokenExtractor } = require('../utils/authorization')
const router = require('express').Router()
const { sequelize } = require('../utils/db')

router.delete('/', tokenExtractor, async (req, res) => {
  const authorization = req.get('authorization')
  // Should be tested with multiple devices.
  if (authorization) {
    if (req.body.all) {
      await sequelize.query(`DELETE FROM active_sessions
          USING user_sessions
          WHERE :user_id = user_sessions.user_id;
        `,
        {
          replacements: { 'user_id': req.decodedToken.id,           
          type: QueryTypes.DELETE
        }
      })
      res.status(200).end()
    } else {
      await ActiveSessions.destroy({
        where: {
          active_session_token: authorization.substring(7)
        }
      })
      res.status(200).end()
    }
    res.status(404).end()
  }
})

module.exports = router