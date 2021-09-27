import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const config = new pulumi.Config();
const stack = pulumi.getStack();

const zoneId = config.require("hostedZoneId");

const cert = new aws.acm.Certificate(`portfolio-cert-${stack}`, {
  domainName: "niccannon.com",
  subjectAlternativeNames: ["*.niccannon.com", "www.niccannon.com", "www.old.niccannon.com"],
  validationMethod: "DNS",
  tags: {
    project: `portfolio-${stack}`,
  },
});

const validationOpts = cert.domainValidationOptions.apply((dvo) =>
  dvo.map((rec) => ({
    name: rec.resourceRecordName,
    value: rec.resourceRecordValue,
    type: rec.resourceRecordType,
    domainName: rec.domainName,
  }))
);

const valRecords = validationOpts.apply((opts) =>
  opts.map(
    (opt) =>
      new aws.route53.Record(`portfolio-val-rec-${opt.domainName}-${stack}`, {
        allowOverwrite: true,
        name: opt.name,
        records: [opt.value],
        ttl: 60,
        type: opt.type,
        zoneId,
      })
  )
);

const certValidation = new aws.acm.CertificateValidation(`portfolio-cert-val-${stack}`, {
  certificateArn: cert.arn,
  validationRecordFqdns: valRecords.apply((recs) => recs.map((record) => record.fqdn)),
});

export const certArn = certValidation.certificateArn;
