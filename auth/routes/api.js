var passport = require('passport');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var express = require('express');
var router = express.Router();
const user_controller = require('../controllers/user.controller');
var VerifyToken = require('../config/VerifyToken');

router.post('/dokter/signup', user_controller.dokter_signup);
router.post('/signup', user_controller.user_signup);
router.post('/dokter/pasien-enrol',passport.authenticate('jwt', { session: false}), user_controller.pasien_enrol);
router.post('/pasien/signup', user_controller.pasien_signup);
router.post('/dokter/dokter-enrolling', user_controller.dokter_enrolling);
router.post('/pasien/search',passport.authenticate('jwt', { session: false}), user_controller.pasien_search);
router.post('/pasien/unroll',passport.authenticate('jwt', { session: false}), user_controller.pasien_unroll);
router.post('/pasien/detail',passport.authenticate('jwt', { session: false}), user_controller.detail_pasien);
router.post('/dokter/data',passport.authenticate('jwt', { session: false}), user_controller.data_on_dokter);
router.get('/dokter/all',passport.authenticate('jwt', { session: false}), user_controller.all_dokter);
router.get('/pasien/all',passport.authenticate('jwt', { session: false}), user_controller.all_pasien);
router.get('/pasien/pending',passport.authenticate('jwt', { session: false}), user_controller.all_pasien_pending);

router.post('/signin', user_controller.signin);
// router.get('/me',VerifyToken, user_controller.me);
router.get('/pasien/profile',passport.authenticate('jwt', { session: false}),user_controller.pasien_profile);
router.get('/dokter/profile',passport.authenticate('jwt', { session: false}),user_controller.dokter_profile);

// router.get('/logout',user_controller.logout);
// router.delete('/:id/delete',passport.authenticate('jwt', { session: false}), user_controller.user_delete);
// router.put('/:id/update',passport.authenticate('jwt', { session: false}),user_controller.user_update);
// router.get('/alluser',passport.authenticate('jwt', { session: false}),user_controller.all_peternak);
// router.post('/book', passport.authenticate('jwt', { session: false}),user_controller.book_post);
// router.get('/book', passport.authenticate('jwt', { session: false}), user_controller.book_get);

module.exports = router;
