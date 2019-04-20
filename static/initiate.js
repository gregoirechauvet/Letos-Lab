window.addEventListener('load', () => {
	const topAppBarElement = document.querySelector('.mdc-top-app-bar');
	const topAppBar = mdc.topAppBar.MDCTopAppBar.attachTo(topAppBarElement);

	const drawerElement = document.querySelector('.mdc-drawer');
	if (drawerElement) {
		const drawer = mdc.drawer.MDCDrawer.attachTo(drawerElement);
		drawer.open = true;

		topAppBar.listen('MDCTopAppBar:nav', () => {
			drawer.open = !drawer.open;
		});
	}

	const buttons = document.querySelectorAll('.mdc-button');
	buttons.forEach(button => {
		mdc.ripple.MDCRipple.attachTo(button);
	});

	const textFields = document.querySelectorAll('.mdc-text-field');
	textFields.forEach(textField => {
		mdc.textField.MDCTextField.attachTo(textField);
	});

	// FormFields with checkbox
	const formfields = document.querySelectorAll('.mdc-form-field');
	formfields.forEach(field => {
		const formfield = mdc.formField.MDCFormField.attachTo(field);
		const checkbox = mdc.checkbox.MDCCheckbox.attachTo(field.querySelector('.mdc-checkbox'));
		field.input = checkbox;
	});

	const selects = document.querySelectorAll('.mdc-select');
	selects.forEach(select => {
		mdc.select.MDCSelect.attachTo(select);
	});
});
