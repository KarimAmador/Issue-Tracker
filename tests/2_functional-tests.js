const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let issue1, issue2;

suite('Functional Tests', function () {
  this.timeout(5000);

  test('Create an issue with every field: POST request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/issues/functional-tests')
      .send({
        issue_title: 'All fields',
        issue_text: 'Text',
        created_by: 'Chai',
        assigned_to: 'Dev',
        status_text: 'In progress'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isOk(res.body._id, '_id must exist');
        assert.equal(res.body.issue_title, 'All fields');
        assert.equal(res.body.issue_text, 'Text');
        assert.equal(res.body.created_by, 'Chai');
        assert.equal(res.body.assigned_to, 'Dev');
        assert.equal(res.body.status_text, 'In progress');
        assert.isOk(res.body.created_on, 'created_on must exist');
        assert.isOk(res.body.updated_on, 'updated_on must exist');

        issue1 = res.body;
        done();
      })
    })
  test('Create an issue with only required fields: POST request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/issues/functional-tests')
      .send({
        issue_title: 'Required fields',
        issue_text: 'Text',
        created_by: 'Chai'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isOk(res.body._id, '_id must exist');
        assert.equal(res.body.issue_title, 'Required fields');
        assert.equal(res.body.issue_text, 'Text');
        assert.equal(res.body.created_by, 'Chai');
        assert.equal(res.body.assigned_to, '');
        assert.equal(res.body.status_text, '');
        assert.isOk(res.body.created_on, 'created_on must exist');
        assert.isOk(res.body.updated_on, 'updated_on must exist');

        issue2 = res.body;
        done();
      })
  })
  test('Create an issue with missing required fields: POST request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/issues/functional-tests')
      .send({
        issue_title: 'Missing text and created_by',
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, {error: 'required field(s) missing'})
        done();
      })
  })
  test('View issues on a project: GET request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .keepOpen()
      .get('/api/issues/functional-tests')
      .end(function(err, res) {
        assert.isArray(res.body, 'should be an array of issues');
        assert.isNotEmpty(res.body, 'should have issues');
        res.body.forEach((item) => {
          console.log(item);
          assert.hasAllDeepKeys(item, ['_id', 'issue_title', 'issue_text', 'created_by', 'assigned_to', 'open', 'status_text', 'created_on', 'updated_on']);
        });
        done();
      })
  })
  test('View issues on a project with one filter: GET request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .keepOpen()
      .get('/api/issues/functional-tests')
      .query({issue_title: 'Required fields'})
      .end(function(err, res) {
        assert.isNotEmpty(res.body, 'the list should not be empty');
        assert.equal(res.body[0].issue_title, 'Required fields');
        done();
      })
  })
  test('View issues on a project with multiple filters: GET request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .keepOpen()
      .get('/api/issues/functional-tests')
      .query({issue_title: 'All fields', status_text: 'In progress'})
      .end(function(err, res) {
        assert.isNotEmpty(res.body, 'the list should not be empty');
        assert.equal(res.body[0].issue_title, 'All fields');
        done();
      })
  })
  test('Update one field on an issue: PUT request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .keepOpen()
      .put('/api/issues/functional-tests')
      .send({
        _id: issue1._id,
        issue_text: 'Updated text'
      })
      .end(function(err, res) {
        assert.deepEqual(res.body, {result:'successfully updated', '_id':issue1._id});
        done();
      })
  })
  test('Update multiple fields on an issue: PUT request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .keepOpen()
      .put('/api/issues/functional-tests')
      .send({
        _id: issue2._id,
        issue_title: 'Updated fields',
        assigned_to: 'Dev',
        status_text: 'Done',
        open: 'false'
      })
      .end(function(err, res) {
        assert.deepEqual(res.body, {result:'successfully updated', '_id':issue2._id});
        done();
      })
  })
  test('Update an issue with missing _id: PUT request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .keepOpen()
      .put('/api/issues/functional-tests')
      .send({
        issue_text: 'Update attempt'
      })
      .end(function(err, res) {
        assert.deepEqual(res.body, {error:'missing _id'});
        done();
      })
  })
  test('Update an issue with no fields to update: PUT request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .keepOpen()
      .put('/api/issues/functional-tests')
      .send({
        _id: issue2._id
      })
      .end(function(err, res) {
        assert.deepEqual(res.body, {error:'no update field(s) sent', '_id':issue2._id});
        done();
      })
  })

  let invalid_id = '1234567890a1234567890bc#';

  test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .keepOpen()
      .put('/api/issues/functional-tests')
      .send({
        _id: invalid_id,
        issue_text: 'Update attempt'
      })
      .end(function(err, res) {
        assert.deepEqual(res.body, {error:'could not update', '_id':invalid_id});
        done();
      })
  })
  test('Delete an issue: DELETE request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .keepOpen()
      .delete('/api/issues/functional-tests')
      .send({
        _id: issue1._id
      })
      .end(function(err, res) {
        assert.deepEqual(res.body, {result:'successfully deleted', '_id':issue1._id})
        done();
      })
  })
  test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .keepOpen()
      .delete('/api/issues/functional-tests')
      .send({
        _id: invalid_id
      })
      .end(function(err, res) {
        assert.deepEqual(res.body, {error:'could not delete', '_id':invalid_id})
        done();
      })
  })
  test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .keepOpen()
      .delete('/api/issues/functional-tests')
      .send({
        _id: ''
      })
      .end(function(err, res) {
        assert.deepEqual(res.body, {error:'missing _id'})
        done();
      })
  })
});
