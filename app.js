var parser = require('./modules/parser');

var samples = [
  // 'http://wallgif.com/gif/1052',
  // 'http://www.gifsnation.com/2017/02/too-cute.html',
  // 'https://giphy.com/go/NGFhYmJiNmYt',
  // 'http://artgifsocean.com/full/463/',
  // 'http://fotos.sapo.pt/cantinhomeu/pic/008226rb',
  // 'http://www.phygee.com/gif-detail/daymond-mark/e55668cdf7b6b2001ca419621fccbdb3/cuando-tienes-que-luchar-por-tu-vida',
  // 'http://obiz.gifsgamers.com/show/6379',
  'https://l.facebook.com/l.php?u=http%3A%2F%2Fgph.to%2F2nO3upl&h=ATNbXYxD5OY_XUUhyRBabaSrznvsZUXHYkC2YjnOFG2RwhoYff_UXLwcct8t5bhvydEZOaLxtsOVYtfmRBd9J5451aWXl2aFa4gZUxHUmbXj&s=1&enc=AZPf_nW33566aQt2vToHsoLpU1zyuDNpWBuRiPh-MbSs8F-0hdUhxCJOfgLJUY7RgqdBB9EqKhg8WFeOSIzny8at'
];

samples.forEach(function(uri) {
  parser.extract(uri, function(gif) {
    console.log('> ' + gif);
  });
});
