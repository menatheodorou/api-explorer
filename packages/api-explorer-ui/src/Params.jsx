const React = require('react');
const PropTypes = require('prop-types');
const Form = require('react-jsonschema-form').default;
const UpDownWidget = require('react-jsonschema-form/lib/components/widgets/UpDownWidget').default;
const TextWidget = require('react-jsonschema-form/lib/components/widgets/TextWidget').default;

const ObjectField = require('./form-components/ObjectField');
const SchemaField = require('./form-components/SchemaField');
const FieldTemplate = require('./form-components/FieldTemplate');

const Oas = require('./lib/Oas');

const { Operation } = Oas;
const parametersToJsonSchema = require('./lib/parameters-to-json-schema');

function Params({ oas, operation, formData, onChange, onSubmit }) {
  const jsonSchema = parametersToJsonSchema(operation, oas);
  return (
    <div className="api-manager">
      <div className="param-table">
        {jsonSchema &&
          jsonSchema.map(schema => {
            return [
              <div className="param-header">
                <h3>{schema.label}</h3>
                <div className="param-header-border" />
              </div>,
              <Form
                id={`form-${operation.operationId}`}
                schema={schema.schema}
                widgets={{
                  int64: UpDownWidget,
                  int32: UpDownWidget,
                  TextWidget,
                }}
                // eslint-disable-next-line no-console
                onSubmit={form => onSubmit() && console.log('submit', form.formData)}
                formData={formData[schema.type]}
                onChange={form => {
                  // return onChange({ [schema.type]: { $set: form.formData } })
                  return onChange({ [schema.type]: form.formData });
                }}
                FieldTemplate={FieldTemplate}
                fields={{
                  ObjectField,
                  SchemaField,
                  TitleField: () => null,
                }}
              >
                <button type="submit" style={{ display: 'none' }} />
              </Form>
            ];
          })}
      </div>
    </div>
  );
}

Params.propTypes = {
  oas: PropTypes.instanceOf(Oas).isRequired,
  operation: PropTypes.instanceOf(Operation).isRequired,
  formData: PropTypes.shape({}).isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

module.exports = Params;
