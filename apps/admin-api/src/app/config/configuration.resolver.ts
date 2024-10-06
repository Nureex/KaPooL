import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CurrentConfiguration,
  UpdateConfigResult,
  UpdatePurchaseCodeResult,
} from './config.dto';
import { ConfigurationService } from './configuration.service';
import { UpdateConfigInput } from './update-config.input';
import { ForbiddenError } from '@nestjs/apollo';

@Resolver()
export class ConfigurationResolver {
  constructor(private configurationService: ConfigurationService) {}
  // @Mutation(() => UploadResult)
  // async uploads(@Args('input', { type: () => GraphQLUpload }) {createReadStream,filename}): Promise<{url: string}> {
  //     return {url: filename};
  // }

  @Query(() => CurrentConfiguration)
  async currentConfiguration(): Promise<CurrentConfiguration> {
    const currentConfig = await this.configurationService.getConfiguration();
    if (process.env.DEMO_MODE != null) {
      return {
        purchaseCode: 'RESTRICTED',
        adminPanelAPIKey: currentConfig.adminPanelAPIKey,
        firebaseProjectPrivateKey: currentConfig.firebaseProjectPrivateKey,
      };
    }
    return currentConfig;
  }

  @Mutation(() => UpdatePurchaseCodeResult)
  async updatePurchaseCode(
    @Args('purchaseCode', { type: () => String }) purchaseCode: string,
    @Args('email', { type: () => String, nullable: true }) email?: string,
  ): Promise<UpdatePurchaseCodeResult> {
    return this.configurationService.updatePurchaseCode(purchaseCode, email);
  }

  @Mutation(() => UpdateConfigResult)
  async updateMapsAPIKey(
    @Args('backend', { type: () => String }) backend: string,
    @Args('adminPanel', { type: () => String }) adminPanel: string,
  ): Promise<UpdateConfigResult> {
    return this.configurationService.updateMapsAPIKey(backend, adminPanel);
  }

  @Mutation(() => UpdateConfigResult)
  async updateFirebase(
    @Args('keyFileName', { type: () => String }) keyFileName: string,
  ): Promise<UpdateConfigResult> {
    return this.configurationService.updateFirebase(keyFileName);
  }

  @Mutation(() => UpdateConfigResult)
  async disablePreviousServer(
    @Args('ip', { type: () => String }) ip: string,
  ): Promise<UpdateConfigResult> {
    return this.configurationService.disablePreviousServer(ip);
  }

  @Mutation(() => CurrentConfiguration)
  async saveConfiguration(
    @Args('input', { type: () => UpdateConfigInput })
    input: CurrentConfiguration,
  ) {
    return this.configurationService.saveConfiguration(input);
  }
}
