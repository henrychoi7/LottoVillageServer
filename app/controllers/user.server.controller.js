exports.login = function (req, res) {
    /*if (req.session.visit) {
        req.session.lastVisit = req.session.visit;
        req.session.visit = new Date();
    }

    req.session.visit = new Date();
    console.log('접속시간 : ' + req.session.visit);

    if (req.session.lastVisit !== undefined) {
        console.log('마지막접속시간 : ' + req.session.lastVisit)
    }*/

    console.log('--------login--------');
    console.log(req.query.phone_no);
    console.log(req.query.password);
    console.log(req.cookies.jjsoft_lotto_village);

    var pool = require(process.cwd() + '/config/maria.pool');
    pool.getConnection(function (err, connection) {
        connection.query({
                sql: 'SELECT PHONE_NO \
                  FROM USER_INFO \
                  WHERE PHONE_NO = ? \
                  AND PASSWORD = ?',
                timeout: 40000
            },
            [req.query.phone_no, req.query.password],
            function (error, results, columns) {
                connection.release();

                if (error) throw error;

                if (!results.length) return res.json({isSuccess: false, errorMessage: "해당 유저를 찾을 수 없습니다."});

                req.session.phone_no = req.query.phone_no;
                req.session.password = req.query.password;
                req.session.cookies = req.cookies.jjsoft_lotto_village;

                //res.cookie('jjsoft_lotto_village', 'dngus', {expires: new Date(Date.now() + 90000), httpOnly: true});
                /*var cookie = req.cookies.jjsoft_lotto_village;
                if (cookie === undefined) {
                    var randomeNumber = Math.random().toString();
                    randomeNumber=randomeNumber.substring(2,randomeNumber.length);
                    //res.cookie('jjsoft_lotto_village',randomeNumber, {maxAge:60*1000, httpOnly: true});
                    //res.append('Set-Cookie', 'jjsoft_lotto_village; Path=/; HttpOnly');
                }*/
                //req.session.cookie=req.cookies;
                //console.log(req.cookies.jjsoft_lotto_village);
                //console.log(res.cookie);
                console.log(req.session);

                res.json({isSuccess: true, errorMessage: ""});
            });
    });
};

exports.logout = function (req, res) {
    console.log('--------logout--------');
    console.log(req.session.phone_no);
    console.log(req.session.password);
    console.log(req.cookies);
    console.log(req.session);
    if (req.session.id === undefined || req.session.password === undefined) {
        return res.json({isSuccess: false, errorMessage: "로그인된 내역이 없습니다."});
    }
    req.session.destroy();
    res.clearCookie('jjsoft_lotto_village');
    res.json({isSuccess: true, errorMessage: "로그아웃 되었습니다."});
};

exports.register = function (req, res) {
    console.log(req.body);
    console.log(req.body.name);

    res.render('index', {
        title: "회원가입"
    });
};