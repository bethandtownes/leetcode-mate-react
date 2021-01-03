const fetch = require("node-fetch");


var fs = require("fs")
const requestHeader = {
    'authority': 'leetcode.com',
    'accept': '*/*',
    'path': '/api/problems/all',
    'accept-encoding': 'gzip, deflate, br', 
    'accept-language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh-TW;q=0.7,zh;q=0.6',
    'content-type': 'application/json',
    'origin': 'https://leetcode.com',
    'referer': 'https://leetcode.com/problems/add-two-numbers/',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',
    // 'x-csrftoken': acquireCsrftoken()
};

fetch("https://leetcode.com/api/problems/all/", { 
    method: "GET",
    headers: requestHeader,
    credentials: 'same-origin',
})
    .then(res => {return res.json()})
    .then(res => {
	let dump2 = {};
	res.stat_status_pairs.map(a => a.stat).map(a => {
	    dump2[a.question__title_slug] = {"question_id": a.question_id, "question_title": a.question__title};
	    return {[a.question__title_slug]: {"question_id": a.question_id,
					       "question_title": a.question__title}
		   }});
	console.log(dump2);
	fs.writeFile('./cache.json', JSON.stringify(dump2, null, 4), (err) => {
	    if (err) {
		console.log(err);
		return;
	    }
	    console.log("cache created");
	});	  
    });
