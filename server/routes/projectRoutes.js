const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  assignDevelopers,
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');

router.use(protect);

router.route('/')
  .get(getProjects)
  .post(authorize('admin'), createProject);

router.route('/:id')
  .get(getProjectById)
  .put(authorize('admin'), updateProject)
  .delete(authorize('admin'), deleteProject);

router.put('/:id/assign', authorize('admin'), assignDevelopers);

module.exports = router;
