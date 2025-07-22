export class TestController {
  static async getTest(req, res) {
    return res.status(200).send({
      message: 'Hello World!',
    });
  }
}
