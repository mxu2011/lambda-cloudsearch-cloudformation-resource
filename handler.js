import AWS from 'aws-sdk';
import Promise from 'bluebird';
import Joi from 'joi';
import { Cloudformation, OK, ERROR } from 'node-lambda-events';

const CREATE_DOMAIN = 'createDomain';

const DELETE_DOMAIN = 'deleteDomain';

const AWS_REGION = 'us-west-2';

const shortId = function (len = 8, prefix = 'dms') {
  const id = [];
  const chars = Math.random().toString(36).substr(2);
  return prefix + Array(len - prefix.length).fill(1).map((i) => {
    return `${chars[Math.floor(Math.random()*chars.length)]}`;
  }).join('');
};

const Schema = Joi.object().keys({
  DomainName: Joi.string().default(shortId, 'id generator')
    .example('12345-abcdef').description('the name of the Cloudsearch Domain')
    .regex(/^[\-0-9a-z]+$/, 'numbers, lowercase letters, hyphens'),
});

class CloudsearchDomain extends Cloudformation {
  async create() {
    try {
      const validated = await this.validate(this.properties);
      const { DomainStatus } = await this.cloudsearch(CREATE_DOMAIN, validated);
      const { DomainId, DomainName, ARN } = DomainStatus
      this.respond(OK, {
        id: DomainName,
        reason: `Created: ${DomainName}`,
        data: {
          DomainId,
          ARN
        }
      });
    } catch (err) {
      this.respond(ERROR, { reason: err.toString(), id: ERROR });
    }
  }

  async update() {
    this.respond(ERROR, { reason: "refused to update domain", id: this.id });
  }

  async delete() {
    try {
      if (this.id) {
        const payload = { DomainName: this.id };
        await this.cloudsearch(DELETE_DOMAIN, payload);
        this.respond(OK, { id: this.id });
      } else {
        this.respond(OK, { id: OK });
      }
    } catch (err) {
      this.respond(ERROR, { reason: err.toString(), id: ERROR });
    }
  }

  validate(obj) {
    return Promise.fromCallback(cb => Joi.validate(obj, Schema, cb));
  }

  cloudsearch(op, params) {
    return Promise.fromCallback(cb => this.client[op](params, cb));
  }

  get client() {
    return new AWS.CloudSearch({ region: AWS_REGION });
  }
}

export const CloudsearchDomainMxu = Cloudformation.wrap(CloudsearchDomain);
