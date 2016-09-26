var express = require('express');
var router = express.Router();
var _ = require('underscore');
var bodyParser = require('body-parser');
var Movie = require('../models/movie');
var emptyMovie = {
    title: "",
    doctor: "",
    country: "",
    language: "",
    year: "",
    poster: "",
    video:"",
    summary: ""
};
/* GET 首页 */
router.get('/', function(req, res, next) {
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('index', {title:'电影-首页', movies: movies});
    });
});
/* GET 列表页 */
router.get('/list', function(req, res, next) {

    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('list', {title:'电影-列表页', movies: movies});
    });
});
/* GET 详情页 */
router.get('/detail/:id', function(req, res, next) {
	var id = req.params.id;
    Movie.findById(id,function (err, movie) {
        if (err) {
            console.log(err);
        }
        res.render('detail', {title:'电影-详情页', movie: movie});
    });
});
/* GET 后台录入页 */
router.get('/admin/new', function(req, res, next) {
        res.render('new', {title:'电影-后台录入页', movie: emptyMovie});
    });
/* GET 逻辑控制:插入 */
router.post('/admin/control/new', function (req, res) {
    var movieObj = req.body.movie;
    var id = movieObj._id;
    var _movie;
    if (id != 'undefined') {
        Movie.findById(id, function (err, movie) {
            if (err) {
                console.log(err);
            }
            _movie = _.extend(movie, movieObj);
            _movie.save(function (err, movie) {
                if (err) {
                    console.log(err);
                }

                res.redirect('/detail/' + movie._id);
            });
        });
    } else {
        _movie = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            video: movieObj.video
        });
        _movie.save(function (err, movie) {
            if (err) {
                console.log(err);
            }

            res.redirect('/detail/' + movie._id);
        });
    }
});
// 逻辑控制:更新
router.get('/admin/control/update/:id', function (req, res) {
    var id = req.params.id;

    if (id) {
        Movie.findById(id, function (err, movie) {
            res.render('new', {
                title: '后台更新页',
                movie: movie
            })
        })
    }
});
// 逻辑控制:删除
router.delete('/admin/control/delete', function (req, res) {
    var id = req.query.id;

    if (id) {
        Movie.remove({_id: id}, function (err, movie) {
            if (err) {
                console.log(err);
            } else {
                res.json({success: true});
            }
        });
    }
});
module.exports = router;
