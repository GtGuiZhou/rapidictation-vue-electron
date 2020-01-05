<template>
    <div v-on:keypress.enter="onSubmit">
        <el-form ref="form" :model="formData" :rules="rules" :label-width="getConfig('labelWidth','80px')" >
            <template v-for="field in fields">
                <el-form-item
                        v-if="!isHideField(field.name)"
                        :prop="field.name"
                        :key="field.name"
                        :label="field.comment?field.comment:field.name">
                    <field :disabled="isDisabledField(field.name)" :form-data="formData" :field="field"></field>
                </el-form-item>
            </template>

            <el-form-item>
                <el-button :loading="submitLoading" type="primary" @click="onSubmit" icon="el-icon-s-promotion">提 交
                </el-button>
            </el-form-item>

        </el-form>
    </div>
</template>

<script>
    import Field from "./fields/field";

    export default {
        name: "CrudForm",
        components: {Field},
        props: {
            submit: {
                type: Function,
                required: true
            },
            formData: {
                type: Object,
                required: true
            },
            formConfig: {
                type: Object,
                default: () => ({})
            },
            fields: {
                type: Array,
                default: () => []
            },
        },
        data() {
            return {
                submitLoading: false
            }
        },
        computed: {
          rules () {
              let rules = {}
              this.fields.forEach(field => {
                  rules[field.name]  = 'validate' in field?field.validate:[]
              })
              return rules
          }
        },
        methods: {
            onSubmit() {
                this.$refs.form.validate(async valid => {
                    if (valid) {
                        // 验证成功
                        this.submitLoading = true
                        try {
                            await this.submit(this.formData)
                            this.$notify.success('提交成功')
                            this.$emit('submit-success')
                        } catch (e) {
                            this.$emit('submit-fail')
                        } finally {
                            this.submitLoading = false
                        }
                    } else{
                        return  false
                    }
                })
            },
            // 组件方法
            isHideField(fieldName) {
                const hideFields = this.getConfig('hideFields', [])
                return hideFields.some(item => {
                    return item === fieldName
                })
            },
            isDisabledField(fieldName) {
                const disabledFields = this.getConfig('disabledFields', [])
                return disabledFields.some(item => {
                    return item === fieldName
                })
            },
            // 其他
            getConfig(configName, _default) {
                if (configName in this.formConfig) {
                    return this.formConfig[configName]
                } else {
                    return _default
                }
            }
        }
    }
</script>

<style scoped>
    .range {
        border: 1px solid #e6e6e6;
    }
</style>
