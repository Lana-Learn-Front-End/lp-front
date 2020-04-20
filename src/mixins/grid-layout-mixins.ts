import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class GridLayoutMixin extends Vue {
  @Prop({ type: [Boolean, String, Number], default: false }) cols!: string | number | boolean;
  @Prop({ type: [Boolean, String, Number], default: false }) sm!: string | number | boolean;
  @Prop({ type: [Boolean, String, Number], default: false }) md!: string | number | boolean;
  @Prop({ type: [Boolean, String, Number], default: false }) lg!: string | number | boolean;
  @Prop({ type: [Boolean, String, Number], default: false }) xl!: string | number | boolean;
}
