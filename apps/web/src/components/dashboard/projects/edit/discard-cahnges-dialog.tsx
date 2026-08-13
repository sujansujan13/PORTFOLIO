import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DiscardChangesDialogProps {
    disabled?: boolean;
    onDiscard: () => void;
}

export function DiscardChangesDialog({
    disabled,
    onDiscard,
}: DiscardChangesDialogProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button
                    type="button"
                    disabled={disabled}
                    className="text-xs font-bold text-muted-foreground hover:text-foreground px-3 py-2 hover:bg-accent rounded-md disabled:cursor-not-allowed"
                >
                    Discard Changes
                </button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-red-600">Discard changes?</AlertDialogTitle>
                    <AlertDialogDescription>
                        All unsaved changes will be lost.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                    <AlertDialogAction type="button" onClick={onDiscard}>
                        Discard
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}