import express from 'express';
const router = express.Router();

router.get('/', (req: any, res: any) => {
  res.render('index', {
    title: 'Главная',
    user: req.user,
  });
});

export default router;
