import {
  getNestedValue,
  setNestedValue,
  toInputDate,
  toInputDateTime,
} from '../../utils/formatters';

const EntityForm = ({ fields, formData, onChange, isEdit }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
    {fields.map((field) => {
      if (field.showOnEdit === false && isEdit) return null;
      if (field.showOnCreate === false && !isEdit) return null;

      const value = getNestedValue(formData, field.name) ?? '';
      const colSpan = field.fullWidth ? 'sm:col-span-2' : '';

      const handleChange = (event) => {
        const nextValue =
          field.type === 'checkbox'
            ? event.target.checked
            : event.target.value;
        onChange(setNestedValue(formData, field.name, nextValue));
      };

      return (
        <div key={field.name} className={colSpan}>
          <label className="mb-1.5 block text-sm font-medium">
            {field.label}
            {field.required && <span className="text-red-500"> *</span>}
          </label>

          {field.type === 'select' ? (
            <select
              name={field.name}
              value={value}
              onChange={handleChange}
              required={field.required}
              className="input"
            >
              <option value="">Select...</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : field.type === 'textarea' ? (
            <textarea
              name={field.name}
              value={value}
              onChange={handleChange}
              required={field.required}
              rows={field.rows || 3}
              className="input resize-none"
              placeholder={field.placeholder}
            />
          ) : field.type === 'checkbox' ? (
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name={field.name}
                checked={Boolean(value)}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {field.checkboxLabel || field.label}
              </span>
            </label>
          ) : (
            <input
              type={field.type || 'text'}
              name={field.name}
              value={
                field.type === 'date'
                  ? toInputDate(value)
                  : field.type === 'datetime-local'
                    ? toInputDateTime(value)
                    : value
              }
              onChange={handleChange}
              required={field.required}
              min={field.min}
              step={field.step}
              className="input"
              placeholder={field.placeholder}
            />
          )}

          {field.hint && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {field.hint}
            </p>
          )}
        </div>
      );
    })}
  </div>
);

export default EntityForm;
