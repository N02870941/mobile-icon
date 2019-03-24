const app = require('../app/app').app
const request = require('supertest');

// https://codewithhugo.com/testing-an-express-app-with-supertest-moxios-and-jest/

describe('Test the root path', () => {
    test('Fetch index.html from root path', (done) => {
        request(app).get('/').then((response) => {
          expect(response.statusCode).toBe(200)
          done()
        })
    })
})

describe('Test sentry endpoint for fetching DSN for GUI', () => {
  test('DSN should be truth', (done) => {
    request(app).get('/sentry').then((response) => {
      expect(response.body.dsn).toBeTruthy()
      expect(response.statusCode).toBe(200)
      done()
    })
  })
})

describe('Unsuccessful POST /upload', () => {
  test('Send payload without a file', (done) => {
    request(app)
    .post('/upload')
    .send({name: 'Jabari'})
    .expect(406)
    .end((err, res) => {
      if (err) {
        return done(err)
      }
      done()
    })
  })

  test('Post with photo that is too large', (done) => {
    request(app)
    .post('/upload')
    .attach('file', 'test/img/large-icon.jpeg')
    .expect(406)
    .end((err, res) => {
      if (err) return done(err)
      else done()
    })
  })

  test('Post file with invalid file format / extension', (done) => {
    request(app)
    .post('/upload')
    .attach('file', 'test/img/icon.txt')
    .expect(406)
    .end((err, res) => {
      if (err) return done(err)
      else done()
    })
  })
})

describe('Successful POST /upload', () => {
  test('Send single file', (done) => {
    request(app)
      .post('/upload')
      .attach('file', 'test/img/icon.jpeg')
      .expect(200)
      .end((err, res) => {

        if (err) {
          return done(err)
        }
        done()
      })
  })

  test('Send several files', async (done) => {
    let promises = []
    let i = 0

    while (i < 10) {
      promises.push(
        request(app)
        .post('/upload')
        .attach('file', 'test/img/icon.jpeg')
      )

      i++
    }

    Promise
    .all(promises)
    .then(responses => {

      responses.forEach(response => {
        expect(response.statusCode).toBe(200)
      })
    })
    .catch(error => {
      done(error)
    })
    .finally(done)

    // 3 minutes (CICD servers may be slow)
  }, 180000)
})
