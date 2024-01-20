import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as eks from 'aws-cdk-lib/aws-eks';


export interface DemoAppProps extends cdk.StackProps {
  /**
   * Deploy Environment
   * @type {string}
   * @memberof DemoAppProps
   * @default dev
   */
  readonly deployEnv?: string;
}
export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, constructId: string, props: DemoAppProps) {
    super(scope, constructId, props);

    const vpc = this.createVPC(this, constructId);

    const cluster = this.createCluster(this, constructId, vpc);
    const ng1 = this.createNodeGroup(this, constructId, cluster);
  }


  createVPC(scope: Construct, constructId: string): ec2.Vpc {
    return new ec2.Vpc(scope, constructId + "-VPC", {
      ipAddresses: ec2.IpAddresses.cidr('10.1.0.0/16'),
      defaultInstanceTenancy: ec2.DefaultInstanceTenancy.DEFAULT,
      natGateways: 3,
      vpcName: constructId + "-vpc",
      maxAzs: 3,
      ipProtocol: ec2.IpProtocol.IPV4_ONLY,
      createInternetGateway: true,
      restrictDefaultSecurityGroup: true,
      subnetConfiguration: [{
        name: constructId + '-isolated',
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        cidrMask: 18
        },
        {
          name: constructId + '-public',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 28
        }
      ],
    });
  }


  createCluster(scope: Construct, constructId: string, vpc: ec2.Vpc): eks.Cluster {
    const cluster = new eks.Cluster(scope, 'eks-cluster', {
      clusterName: constructId + "-eks-cluster",
      version: eks.KubernetesVersion.V1_28,
      defaultCapacity: 0,
      defaultCapacityType: eks.DefaultCapacityType.NODEGROUP,
      endpointAccess: eks.EndpointAccess.PUBLIC_AND_PRIVATE,
      albController: {
        version: eks.AlbControllerVersion.V2_6_2
      },
      vpc
    });
    return cluster;
  }

  createNodeGroup(scope: Construct, constructId: string, cluster: eks.Cluster): eks.Nodegroup {
    return new eks.Nodegroup(scope, constructId + 'nodegroup', {
      cluster: cluster,
      amiType: eks.NodegroupAmiType.AL2_X86_64,
      capacityType: eks.CapacityType.SPOT,
      instanceTypes: [ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MEDIUM)],
      maxSize: 4,
      desiredSize: 3,
      diskSize: 50,
      forceUpdate: false,
      nodegroupName: constructId + "-ng",
    });
  }
}
