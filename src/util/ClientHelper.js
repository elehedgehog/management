import { Coder } from './Coder'

const baseUrl = 'http://119.29.102.103:18888/',
  comUrl = `/user/post/,/`;

export class userClient {
  static async loginIn(phoneNum, password, regId='weihui') {
    let params = {
      phoneNum,
      password,
      regId,
    }
    let res = await fetch(baseUrl + Coder.encode('user/login' + comUrl), {
      method: 'post',
      mode: 'cors',
      headers: { "Content-Type": 'application/x-www-form-urlencoded' },
      body: computePostString(params),
    });
    let msg = await res.json();
    if(msg.result === 'S_OK')
      return msg.tagObject
    else 
      return false
  }

  static async loginOut(userId) {
    let params = { userId };
    let res = await fetch(baseUrl + Coder.encode('user/quit' + comUrl),{
      method: 'post',
      mode: 'cors',
      headers: { "Content-Type": 'application/x-www-form-urlencoded' },
      body: computePostString(params),
    });
    let msg = await res.json();
    if(msg.result === 'S_OK')
      return true
    else 
      return false
  }
}

export class newsClient {
  static async getNewsList() {
    let res = await fetch(baseUrl + Coder.encode('news/list' + comUrl), {
      method: 'post',
      mode: 'cors',
      headers: { "Content-Type": 'application/x-www-form-urlencoded' },
      body: { random: Math.random()},
    });
    let msg = await res.json();
    if(msg.result === 'S_OK')
      return msg.tagObject
    else 
      return false
  }

  static async addNews(province, content, pic, title, text, published) {
    let params = {
      province: province,
      content: content,
      pic: pic,
      title: title,
      text: text,
      published: published,
    }
    let res = await fetch(baseUrl + Coder.encode('news/add' + comUrl), {
      method: 'post',
      mode: 'cors',
      headers: { "Content-Type": 'application/x-www-form-urlencoded' },
      body: computePostString(params),
    });
    let msg = await res.json();
    console.log(msg)
    if(msg.result === 'S_OK')
      return msg.tagObject
    else 
      return false
  }

  static async modifyNews(province, content, pic, title, text, published, newsid) {
    let params = {
      province: province,
      content: content,
      pic: pic,
      title: title,
      text: text,
      published: published,
      newsid: newsid,
    }
    let res = await fetch(baseUrl + Coder.encode('news/modify' + comUrl), {
       method: 'post',
       mode: 'cors',
       headers: {"Content-Type": 'application/x-www-form-urlencoded'},
       body:  computePostString(params),
    });
    let msg = await res.json();
    console.log(msg);
    if(msg.result === 'S_OK')
      return msg.tagObject
    else
      return false
  }

  static async removeNews(province, newsid) {
    let params = {
        province: province,
        newsid: newsid,
    }
    let res = await fetch(baseUrl + Coder.encode('news/remove' + comUrl), {
        method: 'post',
        mode: 'cors',
        headers: { "Content-Type": 'application/x-www-form-urlencoded' },
        body: computePostString(params),
    });
    let msg = await res.json();
    if(msg.result === 'S_OK')
      return true
    else
      return false
  }

  static async getNewsCon(province, newsid) {
    let params = {
        province: province,
        newsid: newsid,
    }
    let res = await fetch(baseUrl + Coder.encode('news/get' + comUrl), {
        method: 'post',
        mode: 'cors',
        headers: { "Content-Type": 'application/x-www-form-urlencoded' },
        body: computePostString(params),
    });
    let msg = await res.json();
    if(msg.result === 'S_OK')
      return msg.tagObject
    else
      return false
  }

}

function computePostString(data) {
  let encodedString = ''
  Object.keys(data).forEach((key, index) => {
    if (typeof data[key] != 'object' || !data[key]) {
      if (index !== 0) encodedString += '&'
      encodedString += `${key}=${data[key]}`
    } else if (Array.isArray(data[key])) {
      data[key].forEach((el, arrIndex) => {
        if (index !== 0) encodedString += '&'
        encodedString += `${key}[]=${el}`
      })
    } else {
      Object.keys(data[key]).forEach(subKey => {
        if (index !== 0) encodedString += '&'
        encodedString += `${key}[${subKey}]=${data[key][subKey]}`
      })
    }
  })
  return encodedString
}